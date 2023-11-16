import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import multer from "multer";
import sharp from "sharp";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategory.js";

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

// const uploadProductImages = upload.fields([
//   { name: 'imageCover', maxCount: 1 },
//   { name: 'images', maxCount: 3 }
// ])
const uploadCoverImage = upload.single("imageCover");

const resizeCoverImage = catchAsync(async (req, res, next) => {
  //console.log(req.file)

  req.body.imageCover = `product-${req.user.id}-${Date.now()}-cover.jpeg`;
  console.log(req.file.filename);
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/products/${req.body.imageCover}`);

  next();
});

const uploadFiles = upload.array("images", 10);

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
      return res.send(err);
    }

    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `product-${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/products/${newFilename}`);

      req.body.images.push(newFilename);
    })
  );

  next();
};

const createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

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
  const product = await Product.findById(req.params.id).populate("reviews Category SubCategory");
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

const getAllColorsOfAllProducts = catchAsync(async(req,res,next)=>{
  const colors = await Product.aggregate([
   
    {
      $group:{
        _id:null,
        uniqueColors:{$push:'$colors'}
      }
    },
    {$project:{
      _id : 0,
      uniqueColors : {
        $reduce : {
          input : "$uniqueColors", 
          initialValue :[], 
          in : {$let : {
            vars : {elem : { $concatArrays : ["$$this", "$$value"] }},
            in : {$setUnion : "$$elem"}
          }}
        }
      }
    }}
  
  ])
  res.status(200).json({
    status: "success",
    data: {
      uniqueColors:colors[0].uniqueColors,
    },
  });
})

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

const productSearch = catchAsync(async(req,res,next)=>{
  const {keyword} = req.params
  const products = await Product.find({
    $or:[
      { name:{$regex:keyword,$options:'i'}},
      { description:{$regex:keyword,$options:'i'}}
    ]
  })
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
  
})

export {
  getProductsByCategory,
  getProductStatistics,
  createProduct,
  getAllProducts,
  getSoldProductCount,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadCoverImage,
  resizeCoverImage,
  uploadFiles,
  resizeImages,
  addToWishList,
  getProductsBySubCategory,
  getSimilarProducts,
  productSearch,
  getAllColorsOfAllProducts
};
