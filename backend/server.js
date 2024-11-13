
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "node:http";
import cors from "cors";
import morgan from "morgan";
import bodyParser from 'body-parser';
import path from "path";
import passport from "passport";
import { Server } from "socket.io";
import stripeLib from 'stripe';
import twilio from 'twilio'
import sgMail from '@sendgrid/mail';

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import helmet from "helmet";
import Order from './models/orderModel.js'
import Product from './models/productModel.js'
import User from './models/userModel.js'
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

const stripe = stripeLib(process.env.STRIPE_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_SECRET_KEY);
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

const endpointSecret = process.env.STRIPE_WEB_HOOK_SECRET

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  let event;

  // Verify the event's authenticity by checking the signature
  try {
    // The 'req.body' is now a raw buffer, and we pass it to Stripe's constructEvent method
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  switch (event.type) {
    case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      console.log('PaymentIntent was created', paymentIntentCreated);

      // You can add custom logic here if needed, for example:
      // - Store PaymentIntent details in your database
      // - Trigger any action you want when a PaymentIntent is created
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);
      
      const orderId = paymentIntent.metadata.orderId;
      const userId = paymentIntent.metadata.userId  // Assuming you stored orderId in metadata when creating PaymentIntent
      const user = await User.findOne({_id:userId})
      // Update payment status in the Order model
      await Order.updateOne(
        { orderId: orderId },
        { $set: { paymentStatus: 'paid' } }
      );

      const order = await Order.findOne({ orderId });
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock -= item.count;
          await product.save();
        }
      }
      try{
        const smsMessage = `Your order ${orderId} has been placed..Thankyou for your purchase`
        await twilioClient.messages.create({
          body:smsMessage,
          from:process.env.TWILIO_PHONE_NUMBER,
          to:order.address.phoneNumber
        })

      }catch(smsError){
        console.error('Error sendign sms',smsError)
      }

      try {
        const emailMessage = {
          to: user.email,  // Customer's email
          from: process.env.SENDGRID_SENDER_EMAIL,  // Your SendGrid sender email
          subject: `Order Confirmation - ${orderId}`,
          html: `
            <h1>Your Order has been Confirmed!</h1>
            <p>Order ID: ${orderId}</p>
            <p>Thank you for your purchase. We are processing your order now.</p>
          `,
        };
        await sgMail.send(emailMessage);
        console.log('Email sent successfully!');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      break;

    case 'payment_intent.payment_failed':
      const paymentFailedIntent = event.data.object;
      console.log('PaymentIntent failed', paymentFailedIntent);

      const failedOrderId = paymentFailedIntent.metadata.orderId;

      // Update payment status to "failed"
      await Order.updateOne(
        { orderId: failedOrderId },
        { $set: { paymentStatus: 'failed' } }
      );
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  res.status(200).send('Event received');
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








app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
