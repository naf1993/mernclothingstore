import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "node:http";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import { googleStrategy } from "./services/googleStrategy.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import bodyParser from "body-parser";
import couponRoutes from "./routes/couponRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import Order from "./models/orderModel.js";
import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { fileURLToPath } from "url";
import colors from "colors";
import connectDB from "./config/db.js";
import { webhookHandler } from "./controllers/orderController.js";
import { v2 as cloudinary } from "cloudinary";
import { UserRecommendation } from "./models/userModel.js";
import { SessionsClient } from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";
import Product from "./models/productModel.js";
connectDB();

const sessionClient = new SessionsClient();
const sessionId = uuidv4();
const sessionPath = sessionClient.projectAgentSessionPath(
  process.env.GOOGLE_PROJECT_ID,
  sessionId
);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000" // Allow all origins in development
        : [process.env.FRONTEND_VERCEL_URL, process.env.FRONTEND_URL], //,  // Vercel app URL for production
    credentials: true, // Allow credentials (cookies, Authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "sessionId"],
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
app.use((req, res, next) => {
  req.io = io;
  next();
});
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000" // Local development (localhost)
      : [process.env.FRONTEND_URL, process.env.FRONTEND_VERCEL_URL],
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "sessionId"],
};
app.use(cors(corsOptions));
app.use(passport.initialize());
passport.use(googleStrategy);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.post(
  "/api/orders/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhookHandler
);
app.use("/public", express.static("public"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.post("/sendgrid-webhook", (req, res) => {
  //not logging anything
  console.log("Received webhook headers:", req.headers);
  console.log("Received webhook events:", req.body);

  res.status(200).send("Webhook received");
});
// app.post('/sendgrid-webhook', (req, res) => {
//   const events = req.body; // SendGrid sends an array of events

//   // Loop through each event and handle them
//   events.forEach(event => {
//     switch (event.event) {
//       case 'delivered':
//         console.log(`Email to ${event.email} was delivered`);
//         break;
//       case 'bounce':
//         console.log(`Email to ${event.email} bounced`);
//         break;
//       case 'open':
//         console.log(`Email to ${event.email} was opened`);
//         break;
//       case 'click':
//         console.log(`Email to ${event.email} clicked a link`);
//         break;
//       case 'spamreport':
//         console.log(`Email to ${event.email} was marked as spam`);
//         break;
//       default:
//         console.log(`Received unknown event: ${event.event}`);
//     }
//   });

//   // Respond with status 200 to acknowledge receipt of the webhook
//   res.status(200).send('Event received');
// });

// Application Routes

let x = "outer wear"; // Category name
let y = "Black"; // Color
let z = "M"; // Size
let p = 1000; // Maximum price

const fetchProducts = async () => {
  const products = await Product.aggregate([
    {
      $lookup: {
        from: "categories", // Join with 'categories' collection
        localField: "Category", // Field in 'Product' collection (e.g., category ID)
        foreignField: "_id", // Matching field in 'Category' collection
        as: "product", // Name of the resulting array field
      },
    },
    {
      $unwind: "$product", // Flatten the 'CategoryDetails' array
    },
    {
      $match: {
        $or: [
          {
            "product.name": { $regex: x, $options: "i" },
            colors: { $in: [new RegExp(y, "i")] },
            sizes: { $in: [z] },
            price: { $gte: p },
          },
        ],

        // Case-insensitive match for color
      },
    },
  ]);

  return products;
};

const subproducts = await fetchProducts();
// console.log("this is subproducts", subproducts.length);
// console.log(subproducts);
console.log(new RegExp("hijab", "i").test("Hijab")); // Should print: true
console.log(new RegExp("indigo", "i").test("Indigo")); // Should print: true

app.post("/webhook", async (req, res) => {
  //console.log("Received webhook request:", JSON.stringify(req.body, null, 2));
  const { queryText, parameters } = req.body.queryResult;
  console.log('this is query text',queryText)
  console.log('this is parameters',parameters)
  
  try {
    const request = {
      session: sessionPath,
      queryInput: { text: { text: queryText, languageCode: "en" } },
    };
    const [response] = await sessionClient.detectIntent(request);
    const queryResult = response.queryResult;
    //console.log(queryResult)
   
    if (queryResult.intent.displayName === "productrecommendation") {
      console.log(queryResult.intent.displayName)

      const productType = parameters.product;
      
      const color = parameters.color || '';  
    

      const price = parameters.price || 0; 
     
      const size = parameters.size || ''; 
     
      console.log("Product Type:", productType);
      console.log("Color:", color);
      console.log("Size:", size);
      console.log("Price:", price);
      let products = [];

      products = await Product.aggregate([
        {
          $lookup: {
            from: "categories", // Join with 'categories' collection
            localField: "Category", // Field in 'Product' collection (e.g., category ID)
            foreignField: "_id", // Matching field in 'Category' collection
            as: "product", // Name of the resulting array field
          },
        },
        {
          $unwind: "$product", // Flatten the 'CategoryDetails' array
        },
        {
          $match: {
            $or: [
              {
                "product.name": { $regex: productType, $options: "i" },
                colors: { $in: [new RegExp(color, "i")] },
                "sizes":{$in:[size]},
                "price":{$gte:price}
              },
            ],

            // Case-insensitive match for color
          },
        },
      ]);

      console.log("Found Products:", products); // Log the found products

      if (products.length > 0) {
        res.json({
          fulfillmentText: `I found ${products.length} product(s) for you.`,
          products: products.map((product) => ({
            name: product.name,
            brand: product.brand,
            price: product.price,
            color: product.color,
            sizes: product.sizes.join(", "),
            image: product.images[0],
          })),
        });
      } else {
        res.json({
          fulfillmentText: `Sorry, I couldn't find any products for "${productType}" in "${color}".`,
        });
      }
    } else if (queryResult.intent.displayName === "orderstatus") {
      const orderId = parameters.order_id.stringValue;
      if (orderId) {
        const order = await Order.findOne({ orderId: orderId });
        if (order) {
          res.json({
            fulfillmentText: `Your order #${order.orderId} is currently ${order.orderStatus}.`,
            shipping: `Shipping fee: $${order.shippingFee}`,
            payment: `Payment Method: ${order.paymentMethod}`,
            products: order.products.map((product) => ({
              product: product.product,
              count: product.count,
              color: product.color,
              size: product.size,
            })),
          });
        } else {
          res.json({
            fulfillmentText: `Sorry, I couldn't find an order with ID #${orderId}.`,
          });
        }
      } else {
        res.json({ fulfillmentText: `Sorry, no order ID was provided.` });
      }
    } else {
      res.json({
        fulfillmentText:
          queryResult.fulfillmentText || "I am not sure how to help with that.",
      });
    }
  } catch (error) {
    console.error("Error processing Dialogflow request:", error);
    res.status(500).json({
      fulfillmentText: "Sorry, something went wrong. Please try again later.",
    });
  }
});

app.use("/", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.set("trust proxy", 1); // Important for reverse proxy (Heroku)

// Route to log product interactions (view, click, etc.)

// let recommendationModel = null;

// // Model training endpoint
// app.post("/trainmodel", async (req, res) => {
//   try {
//     recommendationModel = await trainRecommendationModel(); // Train and save the model
//     res.status(200).send("Model training completed");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error training the model");
//   }
// });

// const getProductIndex = (productId, products) => {
//   // Check if productId is valid
//   if (!productId) {
//     console.error("Invalid productId:", productId);  // Log invalid productId
//     return -1; // Return -1 if productId is invalid
//   }

//   // Example: Assuming products is an array of product objects with a unique '_id' field
//   return products.findIndex(
//     (product) => product._id.toString() === productId.toString()
//   );
// };

// app.post("/cacheRecommendations", async (req, res) => {
//   if (!recommendationModel) {
//     return res.status(500).send("Model not trained yet.");
//   }

//   try {
//     const users = await User.find();
//     const products = await Product.find();

//     for (const user of users) {
//       const productIndices = [];
//       const userIndices = [];

//       // Check if the user has any interactions
//       const interactionCount = await Interaction.countDocuments({ userId: user._id });
//       if (interactionCount === 0) {
//         console.log(`No interactions found for user: ${user._id}`);
//         // Fetch popular products for users with no interactions
//         const popularProducts = await recommendedProductsForNewUser();

//         // Cache the popular products as recommendations
//         await UserRecommendation.findOneAndUpdate(
//           { userId: user._id },
//           { userId: user._id, recommendations: popularProducts },
//           { upsert: true } // Insert or update if the user already has recommendations
//         );
//         continue; // Skip further processing for this user
//       }

//       const interactions = await aggregateInteractions(user._id);
//       console.log("User Interactions:", interactions);

//       if (interactions && interactions.length > 0) {
//         interactions.forEach((interaction) => {
//           const productIndex = getProductIndex(interaction._id, products);
//           if (productIndex !== -1) {
//             userIndices.push(user._id.toString());
//             productIndices.push(productIndex);
//           }
//         });

//         // Validate tensor shapes and contents
//         if (userIndices.length === productIndices.length && userIndices.length > 0) {
//           const userTensor = tf.tensor(userIndices, [userIndices.length, 1], "int32");
//           const productTensor = tf.tensor(productIndices, [productIndices.length, 1], "int32");

//           console.log("User Tensor Shape:", userTensor.shape);
//           console.log("Product Tensor Shape:", productTensor.shape);

//           const predictions = recommendationModel.predict([userTensor, productTensor]);
//           const predictionArray = predictions.arraySync();

//           // Ensure predictionArray is properly formed
//           if (predictionArray.length !== productIndices.length) {
//             throw new Error("Prediction array length does not match product indices length.");
//           }

//           const productScores = products.map((product, index) => ({
//             productId: product._id,
//             score: predictionArray[index]?.[0], // Use optional chaining to avoid undefined errors
//           }));

//           productScores.sort((a, b) => b.score - a.score);

//           await UserRecommendation.findOneAndUpdate(
//             { userId: user._id },
//             { userId: user._id, recommendations: productScores.slice(0, 5) },
//             { upsert: true }
//           );
//         } else {
//           console.error("Mismatch between userIndices and productIndices lengths.");
//         }
//       }
//     }

//     res.status(200).send("Recommendations cached successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error caching recommendations");
//   }
// });

// Get recommendations for a user from the cache
app.get("/recommendations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cachedRecommendations = await UserRecommendation.findOne({
      userId,
    }).populate("recommendations.productId");
    let recommendations = cachedRecommendations.recommendations;

    if (!cachedRecommendations) {
      return res.status(404).send("No recommendations found for this user");
    }
    res.status(200).json({
      messsage: "Success",
      recommendations: recommendations,
      length: recommendations.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching recommendations");
  }
});

// Handling unknown routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

// Server setup and start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
