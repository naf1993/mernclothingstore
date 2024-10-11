import path from "path";
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
    cb(new Error("Images only!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
  // Limit file size to 5MB
}).fields([{ name: "images", maxCount: 5 }]);

export const resizeImages = async (req, res, next) => {
  // Check if files are present
  console.log("uploading");
  if (!req.files || !req.files.images) {
    // If no files, proceed to the next middleware
    return next();
  }

  const imagegallery = [];
  const resizedBuffer = [];

  try {
    // Loop through the images to resize them
    for (let i = 0; i < req.files.images.length; i++) {
      const image = req.files.images[i];
      const resizedImage = await sharp(image.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();
      resizedBuffer.push(resizedImage);
    }

    // Upload resized images
    for (const imagebuffer of resizedBuffer) {
      const b64i = dataUri(imagebuffer);
      const uploadimage = await uploadFiles(b64i.content);
      imagegallery.push(uploadimage.url);
    }

    // Add the image URLs to the request body
    req.body.images = imagegallery;

    // Proceed to the next middleware
    next();
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
};

const createProduct = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const {
    name,
    description,
    brand,
    Category,
    price,
    SubCategory,
    isFeatured,
    countInStock,
    images,
    colors,
    sizes,
  } = req.body;

  const product = new Product({
    name,
    description,
    brand,
    Category,
    isFeatured,
    SubCategory,
    price,
    countInStock,
    images,
    colors: colors || [],
    sizes: sizes || [],
  });
  await product.save();
  const notification = {
    user: req.user._id,
    message: `New Product created : ${product.name}`,
    type: "product_created",
  };
  req.io.emit("notification", notification);
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Product.find().populate("Category").populate("SubCategory"),
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
  const { id } = req.params;
  console.log("Before fetching product");
  const product = await Product.findById(id);
  console.log("Product fetched:", product);

  // Check if the product exists
  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  // Handle file uploads if they exist
  if (req.files && req.files.images) {
    // Delete existing images
    console.log("files.present");
    for (const imageUrl of product.images) {
      await deleteFiles(imageUrl);
    }
    console.log("image deleted");

    // Assuming upload() and resizeImages() are defined properly
    await upload(); // Handle uploading the new images
    await resizeImages(); // Resize the uploaded images
  }

  // Update the product properties with the request body
  Object.assign(product, req.body);

  // Save the updated product
  await product.save();

  // Respond with the updated product
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

export const deleteImageFromProduct = catchAsync(async (req, res, next) => {
  const { imageUrl } = req.body;
  console.log(`Attempting to delete image: ${imageUrl}`);

  try {
    // Delete the file from storage
    await deleteFiles(imageUrl);
  } catch (error) {
    console.error(`Failed to delete file: ${error.message}`);
    return next(new AppError("Failed to delete file", 500));
  }

  // Log the image URL being searched for
  console.log(`Searching for product with image URL: ${imageUrl}`);
  const updatedProduct = await Product.findOneAndUpdate(
    { images: imageUrl },
    { $pull: { images: imageUrl } },
    { new: true }
  );

  // Check if the product was found
  if (!updatedProduct) {
    console.warn(`No product found with image URL: ${imageUrl}`);
    return next(new AppError("No Product found", 404));
  }

  // Respond with the updated product or a success message
  res.status(200).json({
    status: "success",
    data: {
      product: updatedProduct,
    },
  });
});


const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("No Product found with that ID", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    await deleteFiles(product.images[i]);
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
  addToWishList,
  getProductsBySubCategory,
  getSimilarProducts,
  productSearch,
  getAllColorsOfAllProducts,
};
