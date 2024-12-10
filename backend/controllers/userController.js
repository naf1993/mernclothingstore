import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import multer from "multer";
import sharp from "sharp";
import Coupon from "../models/couponModel.js";
import Cart from "../models/cartModels.js";
import { Interaction } from "../models/productModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const secretOrKey = process.env.JWT_SECRET;

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single("photo");

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getMe = catchAsync(async(req, res, next) => {
  req.params.id = req.user.id;
  const user = await User.findById(req.params.id).populate('favourites');
  console.log("this is logged in user", user);

  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }
 
  const token = req.user.generateJWT();  // assuming `generateJWT` is a method on your User model
  console.log('this is token from getme ',token)
  res.status(200).json({
    status: "success",
    data: {
      user,
      token,  // Include the token in the response body
    },
  });
  
})

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  console.log("this is logged in user", user);
  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No Product found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const updateUserStatusByAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// controllers/usercontroller.js
export const addInteractions = catchAsync(async (req, res, next) => {
  console.log("Request Body:", req.body); // Debugging the request body

  const { productId, interactionType } = req.body;
  let sessionId;
  let token;
  let userId;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(
        new AppError("You are not logged in..Please login to continue", 401)
      );
    }
    //verify token
    const decoded = await promisify(jwt.verify)(token, secretOrKey);
    //check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token doesnot exist", 401)
      );
    }
    //check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently changed password..Please login again", 401)
      );
    }
    //grant access to protected route
    req.user = currentUser;
    userId = req.user._id;
  } else {
    sessionId = req.sessionId;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in..Please login to continue", 401)
    );
  }

  console.log("SessionId in Controller:", sessionId);
  console.log("UserId in Controller:", userId);

  const interaction = new Interaction({
    userId: userId || null, // Use userId if logged in
    sessionId: sessionId || null, // Use sessionId if anonymous
    productId,
    interactionType,
  });

  await interaction.save();

  res
    .status(201)
    .json({ message: "Interaction recorded successfully", interaction });
});

export const addToFavourites = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { productId } = req.body;
  const user = await User.findById(_id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  // Only add if productId is not already in favourites
  if (!user.favourites.includes(productId)) {
    user.favourites.push(productId);
    await user.save();
  }

  const updatedUser = await User.findById(_id).populate("favourites");

  
  // await addInteractions(user._id, null, productId, "favourites"); // Pass userId and productId to addInteraction

  res.status(200).json({
    status: "success",
    data: {
      favourites: updatedUser.favourites, // Now this contains the full product objects
    },
  });
});

export const removeFromFavourites = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { productId } = req.params;
  const user = await User.findById(_id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  user.favourites = user.favourites.filter(
    (item) => item.toString() !== productId
  );
  await user.save();

  const updatedUser = await User.findById(_id).populate("favourites");

  console.log("Updated favourites after removal:", updatedUser.favourites); // Log updated favorites

  res.status(200).json({
    status: "success",
    data: {
      favourites: updatedUser.favourites, // Now this contains the full product objects
    },
  });
});

export const getFavourites = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);

  const user = await User.findById(_id).populate("favourites");
  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      favourites: user.favourites,
    },
  });
});

const saveAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const applyCoupon = catchAsync(async (req, res, next) => {
  const { coupon } = req.body;
  const todayDate = new Date();

  const validCoupon = await Coupon.findOne({ name: coupon }).populate("expiry");
  if (!validCoupon) {
    return next(new AppError("No Coupon found", 404));
  }

  if (todayDate < validCoupon.expiry) {
    return next(new AppError("Sorry coupon expired", 404));
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }
  let { cartTotal } = await Cart.findOne({ user: user._id }).populate(
    "products.product"
  );
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { user: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      totalAfterDiscount,
    },
  });
  // const user = await User.findByIdAndUpdate(req.params.id,req.body,{
  //   new:true,
  // })

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     user,
  //   },
  // });
});

export {
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  getMe,
  deleteUser,
  updateMe,
  uploadUserPhoto,
  resizeUserPhoto,
  updateUserStatusByAdmin,
  saveAddress,
  applyCoupon,
};
