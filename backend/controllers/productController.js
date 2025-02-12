import dotenv from "dotenv";
dotenv.config();
import path from "path";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import multer from "multer";
import sharp from "sharp";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategory.js";
import { Interaction } from "../models/productModel.js";
import cloudinary from "cloudinary";
import { uploadFiles, deleteFiles } from "../utils/cloudinary.js";
import { dataUri } from "../utils/datauri.js";
import { recommendTopProducts } from "../services/predictRecommendation.js";
import { SessionsClient } from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";
const sessionClient = new SessionsClient();
const sessionId = uuidv4();
const sessionPath = sessionClient.projectAgentSessionPath(
  process.env.GOOGLE_PROJECT_ID,
  sessionId
);

export const sendMessageDialogFlow = async (req, res, next) => {
  console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log(process.env.GOOGLE_PROJECT_ID);
  try {
    const { message } = req.body; // The message to send to Dialogflow
    console.log(message)
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "en", // Change if your agent uses a different language
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const queryResult = response.queryResult;
    //console.log('Dialogflow Quer+y Result:', JSON.stringify(queryResult, null, 2));
    console.log('Parameters:', JSON.stringify(queryResult.parameters, null, 2));
    if (queryResult.intent.displayName === 'productrecommendation') {
      console.log('product recommendation')
    
      // Handling Product Recommendations
      const productType = queryResult.parameters.fields.product ? queryResult.parameters.fields.product.stringValue : null;
      const color = queryResult.parameters.fields.color ? queryResult.parameters.fields.color.stringValue : null;
let products
      // Query MongoDB to find matching products based on category and color
      if(productType && color){
        products = await Product.find({
          'Category.name': new RegExp(productType, 'i'),
          colors: { $in: [new RegExp(color, 'i')] },
        });
        console.log(products)
      }
      

      if (products.length > 0) {
        res.json({
          reply: `I found ${products.length} product(s) for you.`,
          products: products.map((product) => ({
            name: product.name,
            brand: product.brand,
            price: product.price,
            color: product.colors.join(', '),
            sizes: product.sizes.join(', '),
            image: product.images[0],  // assuming the first image as thumbnail
          })),
        });
      } else {
        res.json({
          reply: `Sorry, I couldn't find any products for "${productType}" in "${color}".`,
        });
      }
    } else if (queryResult.intent.displayName === 'Order Status') {
      // Handling Order Status
      const orderId = queryResult.parameters.fields.order_id.stringValue;

      // Query MongoDB to find the order by orderId
      const order = await Order.findOne({ orderId: orderId });

      if (order) {
        res.json({
          reply: `Your order #${order.orderId} is currently ${order.orderStatus}.`,
          shipping: `Shipping fee: $${order.shippingFee}`,
          payment: `Payment Method: ${order.paymentMethod}`,
          products: order.products.map((product) => ({
            product: product.product, // Product ID
            count: product.count,
            color: product.color,
            size: product.size,
          })),
        });
      } else {
        res.json({
          reply: `Sorry, I couldn't find an order with ID #${orderId}.`,
        });
      }
    } else {
      // Default fallback for other intents
      res.json({ reply: queryResult.fulfillmentText });
    } 
  } catch (error) {
    console.error("Dialogflow request failed", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getProductRecommendationOrderStatus = async (req, res) => {
  const { queryResult } = req.body;

  // Product Recommendation Intent
  if (queryResult.intent.displayName === "Product Recommendation") {
    const category = queryResult.parameters["category"]; // e.g., "shoes"
    const maxPrice = queryResult.parameters["price"]; // e.g., 1000
    const brand = queryResult.parameters["brand"]; // e.g., "Nike" (optional)
    const color = queryResult.parameters["color"]; // e.g., "black"
    const size = queryResult.parameters["size"]; // e.g., 38 (could be an array or single value)

    try {
      // Build the query dynamically based on parameters provided by the user
      let productQuery = { category: { $regex: category, $options: "i" } };

      if (maxPrice) {
        // Add price filter if maxPrice is provided
        productQuery.price = { $lte: maxPrice };
      }

      if (brand) {
        // Add brand filter if a brand is provided
        productQuery.brand = { $regex: brand, $options: "i" };
      }

      if (color) {
        // Add color filter if color is provided
        productQuery.color = { $regex: color, $options: "i" };
      }

      if (size) {
        // Add size filter if size is provided
        if (Array.isArray(size)) {
          // If multiple sizes are provided (e.g., size 38, size 40), use the $in operator
          productQuery.sizes = { $in: size };
        } else {
          // If single size is provided (e.g., size 38), check if the size is in the array
          productQuery.sizes = size;
        }
      }

      // Fetch products based on the constructed query
      const products = await Product.find(productQuery);

      if (products.length > 0) {
        // Format the product list with relevant details
        const productList = products.map(
          (product) => `${product.name} - $${product.price}`
        );
        res.json({
          fulfillmentText: `Here are some ${category} recommendations: ${productList.join(
            ", "
          )}`,
        });
      } else {
        res.json({
          fulfillmentText: `Sorry, I couldn't find any ${category} products matching your criteria.`,
        });
      }
    } catch (err) {
      console.error(err);
      res.json({
        fulfillmentText: "I encountered an error while fetching products.",
      });
    }
  }

  // Order Status Intent
  if (queryResult.intent.displayName === "Order Status") {
    const orderId = queryResult.parameters["order_id"]; // e.g., "ORD12345"

    try {
      const order = await Order.findOne({ order_id: orderId });
      if (order) {
        res.json({
          fulfillmentText: `Your order status is: ${order.status}.`,
        });
      } else {
        res.json({ fulfillmentText: "I couldn’t find an order with that ID." });
      }
    } catch (err) {
      res.json({
        fulfillmentText:
          "I encountered an error while checking your order status.",
      });
    }
  }
};
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

  if (!req.files || !req.files.images) {
    // If no files, proceed to the next middleware
    return next();
  }
  console.log("uploading");
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
    req.body.newImages = imagegallery;
    console.log("image uploaded and resized");
    console.log(req.body.newImages);

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

    colors,
    sizes,
  } = req.body;

  const images = req.body.newImages;
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

export const getAllInteractions = catchAsync(async (req, res, next) => {
  const interactions = await Interaction.find();
  if (!interactions) {
    return next(new AppError("No Interactions", 400));
  }
  res
    .status(200)
    .json({
      message: "interactions recieved",
      length: interactions.length,
      interactions,
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

export const getRecommendedProducts = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const topProducts = await recommendTopProducts(userId, 5);
    res.status(200).json({ success: true, recommendations: topProducts });
  } catch (error) {
    console.error(error);
    next(new Error(error.message));
  } // Use next to pass the error to your error handler }
};
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
  console.log("this is req.body", req.body);
  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("No product found with ID", 404));
  }
  if (req.body.newImages) {
    product.images.push(...req.body.newImages);
  }
  Object.assign(product, req.body);
  await product.save();
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
  console.log(updateProduct);
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

export const bulkDeleteProducts = catchAsync(async (req, res, next) => {
  const { productIds, action } = req.body;
  switch (action) {
    case "deleteProducts":
      await Product.deleteMany({ _id: { $in: productIds } });
      return res.status(200).json({ message: "Products Deleted" });

    default:
      return res.status(400).json({ message: "Invalid action" });
  }
});

export const bulkUpdateProductStock = catchAsync(async (req, res, next) => {
  const { productIds } = req.body;
  const incrementBy = parseInt(req.query.incrementBy, 10); // Get incrementBy from query string

  if (!productIds || !productIds.length) {
    return res.status(400).json({ message: "No product IDs provided" });
  }

  if (isNaN(incrementBy)) {
    return res.status(400).json({ message: "Invalid increment value" });
  }

  try {
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $inc: { countInStock: incrementBy } } // Increment countInStock by the query value
    );
    return res.status(200).json({ message: "Products stock updated" });
  } catch (error) {
    console.error("Error performing bulk update:", error);
    return res
      .status(500)
      .json({ error: "Bulk update failed", details: error.message });
  }
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

  // Validate categoryId and productId
  if (!categoryId || !productId) {
    return next(new AppError("Invalid categoryId or productId", 400));
  }

  try {
    const products = await Product.find({
      Category: categoryId,
      _id: { $ne: productId },
    }).limit(4);

    if (products.length === 0) {
      return next(new AppError("No Similar Products", 404));
    }

    console.log("this is related products length", products.length);
    res.status(200).json({
      status: "success",
      length: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    return next(new AppError("Error fetching similar products", 500));
  }
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

export const productsSearchByName = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  // If the search query is too short, return an error
  if (!query || query.length < 3) {
    return next(new AppError("Please enter at least 3 characters", 400)); // Change the status code to 400 for bad request
  }

  // Search for products that match the query
  const products = await Product.find({
    name: { $regex: `^${query}`, $options: "i" },
  })
    .populate("Category")
    .limit(5);

  // Return the search results
  res.status(200).json({
    status: "success",
    length: products.length,
    data: {
      products,
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

export const topSellingProducts = catchAsync(async (req, res, next) => {
  const topProducts = await Order.aggregate([
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products", // Assuming the collection name for products is "products"
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" }, // Unwind the product details array
    {
      $group: {
        _id: "$productDetails.name", // Use product name as the key
        totalSales: { $sum: "$products.price" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 10 }, // Limit to top 10 products
  ]);

  res.status(200).json(topProducts);
});

export const getPopularItems = async () => {
  const popularItems = await Interaction.aggregate([
    {
      $group: {
        _id: "$productId",
        views: {
          $sum: { $cond: [{ $eq: ["$interactionType", "view"] }, 1, 0] },
        },
        purchases: {
          $sum: { $cond: [{ $eq: ["$interactionType", "purchase"] }, 1, 0] },
        },
        addToCart: {
          $sum: { $cond: [{ $eq: ["$interactionType", "add_to_cart"] }, 1, 0] },
        },
        favourites: {
          $sum: { $cond: [{ $eq: ["$interactionType", "favourites"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        score: {
          $add: [
            "$views",
            { $multiply: ["$purchases", 2] },
            { $multiply: ["$addToCart", 1.5] },
            { $multiply: ["$favourites", 1.2] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 10 },
  ]);
  return popularItems.map((item) => item._id);
};

export const getProductAttributes = async (productId) => {
  const product = await Product.findById(productId);
  return {
    Category: product.Category,
    brand: product.brand,
    // Add other relevant attributes
  };
};

export const recommendSimilarItems = async (productId) => {
  const productAttributes = await getProductAttributes(productId);
  const similarItems = await Product.find({
    Category: productAttributes.Category,
    brand: productAttributes.brand,
    _id: { $ne: productId }, // Exclude the current product
  }).limit(10); // Get top 10 similar items

  return similarItems;
};

export const recommendedProductsForNewUser = catchAsync(async (req, res) => {
  console.log("hi");

  // Get the top popular items (product IDs)
  const popularItemsIds = await getPopularItems();
  console.log(popularItemsIds);

  // Fetch the full product details for the popular items
  const popularItems = await Product.find({ _id: { $in: popularItemsIds } });

  // Get attributes of the top popular item to recommend similar items
  const similarItems = await recommendSimilarItems(popularItems[0]._id);

  // Combine results, ensuring no duplicates by checking product _id
  const allProducts = [...popularItems, ...similarItems];

  // Remove duplicates based on product _id by using a Map
  const uniqueProducts = [
    ...new Map(allProducts.map((item) => [item._id.toString(), item])).values(),
  ];

  // Limit to 10 products
  let products = uniqueProducts;
  res
    .status(200)
    .json({ message: "Success", length: products.length, products });
});

// export const recommendedProductsForNewUser = catchAsync(async (req,res) => {
//   console.log('hi')
//   // Get top popular items
//   const popularItems = await getPopularItems();
//   console.log(popularItems)

//   // Get attributes of top popular item to recommend similar items
//   const similarItems = await recommendSimilarItems(popularItems[0]);

//   // Combine results, ensuring no duplicates
//   const recommendations = [
//     ...new Set([...popularItems, ...similarItems.map((item) => item._id)]),
//   ];

//   //return recommendations.slice(0,10);
//   res.status(200).json({
//     products:recommendations
//   })
// })

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
