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
import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { fileURLToPath } from "url";
import colors from "colors";
import connectDB from "./config/db.js";
import { webhookHandler } from "./controllers/orderController.js";
import { v2 as cloudinary } from "cloudinary";
import { UserRecommendation } from "./models/userModel.js";
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000" // Allow all origins in development
        : [
          process.env.FRONTEND_VERCEL_URL, 
          process.env.FRONTEND_URL, 
          ], //,  // Vercel app URL for production
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
      : [
          process.env.FRONTEND_VERCEL_URL, 
          process.env.FRONTEND_URL, 
         
        ],
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
app.set('trust proxy', 1);  // Important for reverse proxy (Heroku)

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
