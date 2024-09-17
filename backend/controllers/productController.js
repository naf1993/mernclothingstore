import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import multer from "multer";
import sharp from "sharp";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategory.js";
import cloudinary from "cloudinary";

import { uploadFiles, deleteFiles } from "../utils/cloudinary.js";
import { dataUri } from "../utils/datauri.js";

const storage = multer.memoryStorage(); // Store files in memory to process with Sharp
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});


const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, brand, Category, price, SubCategory, isFeatured } =
    req.body;
    const newVariants = JSON.parse(req.body.variants).map((variant, index) => ({
      ...variant,
      image: req.files[index].path, // Cloudinary URL
    }));

//   const parsedVariants = JSON.parse(req.body.variants);

//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: "No images uploaded" });
//   }

//   const uploadedImages = [];

//   // Loop through each variant and process its image
//   for (let i = 0; i < req.files.length; i++) {
    
//     const file = req.files[i];

//     // Resize the image using Sharp
//     const resizedImageBuffer = await sharp(file.buffer)
//       .resize(500, 500) // Resize to 500x500 pixels
//       .toFormat("jpeg") // Convert to jpeg
//       .jpeg({ quality: 90 }) // Set image quality to 90%
//       .toBuffer();

//     // Upload the resized image to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream((error, result) => {
//           if (error) {
//             return res.status(500).json({ error: error.message });
//           }
//           resolve(result);
//         })
//         .end(resizedImageBuffer);
//     });
//     console.log("this is result", result);
// console.log(uploadedImages)
//     // Save the Cloudinary image URL for this variant
//     uploadedImages.push({
//       ...parsedVariants[i], // Attach variant color and size
//       image: result.secure_url, // Store Cloudinary URL in the variant
//     });
//     console.log(uploadedImages);
//   }

  const product = new Product({
    name,
    description,
    brand,
    Category,
    isFeatured,
    SubCategory,
    price,
    variants: newVariants,
  });
  await product.save();
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Product.find().populate("Category SubCategory"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews Category SubCategory"
  );
  if (!product) {
    return next(new AppError("No Product found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("No Product found with that ID", 404));
  }
  await deleteFiles(product.imageCover.public_id);

  for (let i = 0; i < product.images.length; i++) {
    await deleteFiles(product.images[i].public_id);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const addToWishList = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishList.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishList: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishList: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.body;

  const category = await Category.findById(categoryId);

  const products = await Product.find({ Category: category }).populate(
    "Category"
  );

  res.status(200).json({
    status: "success",
    length: products.length,
    data: {
      products,
    },
  });
});

const getSimilarProducts = catchAsync(async (req, res, next) => {
  const { categoryId, productId } = req.params;

  const products = await Product.find({
    Category: categoryId,
    _id: { $ne: productId },
  }).limit(4);
  if (products.length === 0) {
    return next(new AppError("No Similar Products", 404));
  }

  res.status(200).json({
    status: "success",
    length: products.length,
    data: {
      products,
    },
  });
});

const getProductsBySubCategory = catchAsync(async (req, res, next) => {
  const { subcategoryId } = req.body;
  const subCategory = await SubCategory.findById(subcategoryId);
  const products = await Product.find({ SubCategory: subCategory }).populate(
    "Category SubCategory"
  );

  res.status(200).json({
    status: "success",
    length: products.length,
    data: {
      products,
    },
  });
});

const getAllColorsOfAllProducts = catchAsync(async (req, res, next) => {
  const colors = await Product.aggregate([
    {
      $group: {
        _id: null,
        uniqueColors: { $push: "$colors" },
      },
    },
    {
      $project: {
        _id: 0,
        uniqueColors: {
          $reduce: {
            input: "$uniqueColors",
            initialValue: [],
            in: {
              $let: {
                vars: { elem: { $concatArrays: ["$$this", "$$value"] } },
                in: { $setUnion: "$$elem" },
              },
            },
          },
        },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      uniqueColors: colors[0].uniqueColors,
    },
  });
});

const getProductStatistics = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    { $match: { price: { $gt: 1000 } } },
    {
      $group: {
        _id: "$name",
        totalDocs: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

const getSoldProductCount = catchAsync(async (req, res, next) => {
  const products = await Product.aggregate([
    {
      $group: {
        _id: null,
        numProducts: { $sum: "$sold" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      noOfProducts: products[0].numProducts,
    },
  });
});

const productSearch = catchAsync(async (req, res, next) => {
  const { keyword } = req.params;
  const products = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  });
  if (products.length === 0) {
    return next(new AppError("No Products", 404));
  }
  res.status(200).json({
    status: "success",
    length: products.length,
    data: {
      products,
    },
  });
});

export {
  getProductsByCategory,
  getProductStatistics,
  createProduct,
  getAllProducts,
  getSoldProductCount,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadImage,
  addToWishList,
  getProductsBySubCategory,
  getSimilarProducts,
  productSearch,
  getAllColorsOfAllProducts,
};
