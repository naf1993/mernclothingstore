
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "node:http";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import passport from "passport";
import { Server } from "socket.io";
import Stripe from "stripe";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import helmet from "helmet";
import Order from './models/orderModel.js'
import { googleStrategy } from "./services/googleStrategy.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js'
import { fileURLToPath } from "url";
import colors from "colors";
import connectDB from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
const stripe = new Stripe(process.env.STRIPE_API_KEY);

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update this for production
    methods: ["GET", "POST"],
  },
  transports: ['websocket', 'polling']
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

// Middleware
app.use(cors());
app.use(passport.initialize());
passport.use(googleStrategy);
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Routes
app.use("/public", express.static("public"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/notifications',notificationRoutes)

app.get("/", function (req, res) {
  res.render("home");
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body; // amount should be in paise
  try {
    // Check if the amount is less than the minimum allowed (50 INR = 5000 paise)
    if (amount < 5000) {
      return res.status(400).send({
        error: "Amount must be at least ₹50 (5000 paise)"
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,  // amount in paise
      currency: 'inr',
      metadata:{orderId//not available until order is created}}
        // Make sure to use INR currency
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Internal Server Error');
  }
});
const endpointSecret = process.env.STRIPE_WEB_HOOK_SECRET
app.post("/webhook", async (req, res) => {
  let event;

  // Verify the event's authenticity by checking the signature
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the different types of events
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!", paymentIntent);
      
      // Assuming you saved the order ID in metadata when creating the PaymentIntent
      const orderId = paymentIntent.metadata.orderId;  // orderId must be set when creating the PaymentIntent
      
      // Update the paymentStatus in the Order model
      await Order.updateOne(
        { orderId: orderId },
        { $set: { paymentStatus: "paid" } }
      );
      
      break;
    case "payment_intent.payment_failed":
      const paymentFailedIntent = event.data.object;
      console.log("PaymentIntent failed", paymentFailedIntent);
      
      const failedOrderId = paymentFailedIntent.metadata.orderId;
      
      // Update the paymentStatus to "failed"
      await Order.updateOne(
        { orderId: failedOrderId },
        { $set: { paymentStatus: "failed" } }
      );
      
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Respond to Stripe to acknowledge receipt of the event
  res.status(200).send("Event received");
});

app.post('/create-payment-intent', async (req, res) => {
  const { products, userId, paymentMethod, discountCode } = req.body; 

  try {
    // Step 1: Create the order to generate the orderId
    const orderId = `ORD${uuidv4().slice(0, 8).toUpperCase()}`;

    // Calculate total price of the products (in paise for INR)
    const totalPrice = products.reduce((acc, item) => acc + item.total, 0) * 100; // Multiply by 100 to convert to paise (INR)

    // Create the order in the database (you can save the `orderId`, user, products, and other details)
    const order = await Order.create({
      orderId,
      user: userId,
      products,
      paymentMethod,
      totalPrice: totalPrice / 100,  // store price in INR (without paise)
      discountCode: discountCode || '',
    });

    // Step 2: Create the payment intent and attach the `orderId` as metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,  // amount in paise (INR)
      currency: 'inr',
      metadata: {
        orderId,  // Store the order ID in metadata
        userId,   // Store the user ID in metadata
      },
    });

    // Send the client secret to the frontend for confirmation
    res.send({ clientSecret: paymentIntent.client_secret, orderId });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
