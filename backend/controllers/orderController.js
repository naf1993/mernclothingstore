import * as dotenv from "dotenv";
dotenv.config();
import stripeLib from "stripe";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModels.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

import { fileURLToPath } from "url";
import { sendToQueue } from "../services/rabbitMqService.js";

const stripe = stripeLib(process.env.STRIPE_API_KEY);
const endpointSecret = process.env.STRIPE_WEB_HOOK_SECRET;

// Get the current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const sendOrderConfirmationEmail = async (order, email) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Confirmation",
    text: `Your order ${order.orderId} has been placed succesfully`,
    html: `<h1>Order Confirmation</h1><p>Your order ${order.orderId} has been placed successfully!</p>`,
  };
  await transporter.sendMail(mailOptions);
};

export const checkIfFirstOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId });

  if (orders.length > 0) {
    return res.status(200).json({
      status: "success",
      data: {
        isFirstOrder: false,
      },
    });
  }
  
  // Only send the response if no orders are found
  return res.status(200).json({
    status: "success",
    data: {
      isFirstOrder: true,
    },
  });
});

export const webhookHandler = catchAsync(async (req, res, next) => {
  // Get the Stripe signature and payload
  const sig = req.headers["stripe-signature"];
  const payload = req.body;

  // Verify the webhook signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
   
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message); // Log any signature verification error
    return next(new AppError("Webhook signature verification failed", 400));
  }

  // Handle the event based on its type
  switch (event.type) {
    case "payment_intent.created":
      const paymentIntentCreated = event.data.object;
     
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      const userId = paymentIntent.metadata.userId;

      if (!orderId || !userId) {
        return next(new AppError("No order or user found in metadata", 400));
      }

      // Find the user and order based on the metadata
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(new AppError(`User with ID ${userId} not found`, 400));
      }

      const order = await Order.findOne({ orderId: orderId });
      if (!order) {
        return next(new AppError(`Order with ID ${orderId} not found`, 400));
      }

      // Prepare order message to send to RabbitMQ
      const orderMessage = {
        user,order,
        products: order.products,
      };

      console.log("Sending order message to RabbitMQ:", orderMessage);
      await sendToQueue(orderMessage);  // Assuming sendToQueue is properly set up to handle this

      break;

    case "payment_intent.payment_failed":
      const paymentFailedIntent = event.data.object;
      console.log("PaymentIntent failed:", paymentFailedIntent);
      const failedOrderId = paymentFailedIntent.metadata.orderId;

      // Update the payment status to "failed" in the order database
      await Order.updateOne(
        { orderId: failedOrderId },
        { $set: { paymentStatus: "failed" } }
      );
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Respond to Stripe that the event has been successfully handled
  res.status(200).send("Event received");
});

export const getPaymentIntent = catchAsync(async (req, res) => {
  const { products, address, paymentMethod, discountCode } = req.body;
  const orderId = `ORD${uuidv4().slice(0, 8).toUpperCase()}`;

  // Ensure that the user is properly authenticated and exists
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const totalPrice = products.reduce((acc, item) => acc + item.total, 0) * 100; // Price in paise
  const userId = user._id;
  

  // Create the order in the database
  const order = await Order.create({
    orderId,
    user: userId,
    products,
    address,
    paymentMethod,
    totalPrice: totalPrice / 100 ,
    discountCode: discountCode || "",
  });
  

  // Create the payment intent and pass both orderId and userId in metadata
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice,
    currency: "inr",
    metadata: {
      orderId: orderId,
      userId: userId.toString(), // Ensure userId is passed as string
    },
  });

 


  return res.status(200).json({
    status: "success",
    data: {
      orderId: orderId,
      clientSecret: paymentIntent.client_secret,
      order,
    },
  });
});

export const createCashOrder = catchAsync(async (req, res, next) => {
  const { userId, products, address, paymentMethod, discountCode } = req.body;

  const orderId = `ORD${uuidv4().slice(0, 8).toUpperCase()}`;

  const user = await User.findById(userId);
  let totalPrice = products.reduce((acc, item) => acc + item.total, 0);

  const order = await Order.create({
    orderId,
    user: userId,
    products,
    address,
    paymentMethod,
    totalPrice,
    discountCode: discountCode || "",
  });

  const orderMessage = {
    user,order,
    products: order.products,
  };

  console.log("Sending order message to RabbitMQ:", orderMessage);
  await sendToQueue(orderMessage); 
  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const bulkUpdateOrders = catchAsync(async (req, res, next) => {
  const { orderIds, action } = req.body;
  switch (action) {
    case "markAsShipped":
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { orderStatus: "Dispatched" } }
      );
      return res.status(200).json({ message: "Orders marked as shipped" });

    case "markAsDelivered":
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { orderStatus: "Delivered" } }
      );
      return res.status(200).json({ message: "Orders marked as delivered" });

    case "cancelOrders":
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { orderStatus: "Cancelled" } }
      );
      return res.status(200).json({ message: "Orders cancelled" });
    case "deleteOrders":
      await Order.deleteMany({ _id: { $in: orderIds } });
      return res.status(200).json({ message: "Orders Deleted" });

    default:
      return res.status(400).json({ message: "Invalid action" });
  }
});
export const getUpdatedOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.query;
  const order = await Order.findOne({ orderId: orderId });
  if (!order) {
    return next(new AppError("No order found", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
export const getSingleOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user")
    .populate("products.productId");
  if (!order) {
    return next(new AppError("No order found", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

const generateOrdersHtml = (orders) => {
  return orders
    .map((order) => {
      const itemsHtml =
        order.products && order.products.length > 0
          ? order.products
              .map(
                (item) => `
        <tr>
          <td>${item.product}</td>
          <td>$${item.price}</td>
          <td>${item.count}</td>
        </tr>`
              )
              .join("")
          : '<tr><td colspan="3">No items found</td></tr>';

      return `
      <div class="order">
        <div class="order-details">
          <p>Order ID: ${order._id}</p>
          <p>Customer: ${order.address.fullName || "N/A"}</p>
          <p>Total Amount: $${order.totalPrice || "0.00"}</p>
        </div>
        <table class="items">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>`;
    })
    .join("");
};

export const generateInvoiceSingle = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { orderIds } = req.query;

  let orderIdList;
  if (orderId) {
    orderIdList = [orderId];
  } else if (orderIds) {
    orderIdList = orderIds.split(",");
  } else {
    return next(new AppError("No order ID(s) provided", 400));
  }

  const orders = await Order.find({ _id: { $in: orderIdList } });
  if (!orders.length) {
    return next(new AppError("No orders found", 404));
  }

  const templatePath = path.join(__dirname, "../views/invoiceTemplate.html");

  if (!fs.existsSync(templatePath)) {
    return next(new AppError("Invoice template not found", 500));
  }

  let template;
  try {
    template = fs.readFileSync(templatePath, "utf8");
  } catch (err) {
    console.error("Error reading template:", err);
    return next(new AppError("Error reading invoice template", 500));
  }

  const ordersHtml = generateOrdersHtml(orders);
  const orderTitle = orders.length > 1 ? "s" : "";

  template = template
    .replace("{{orders}}", ordersHtml)
    .replace("{{orderTitle}}", orderTitle);

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.setContent(template, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const pdfBuffer = Buffer.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      })
    );
    console.log("PDF buffer size:", pdfBuffer.length);
    const isPdfFile = pdfBuffer.toString("utf8", 0, 4) === "%PDF";

    console.log("Is valid PDF:", isPdfFile);

    await browser.close();

    const filename =
      orders.length > 1 ? "invoices.pdf" : `invoice-${orderIdList[0]}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
    console.log("PDF sent successfully");
  } catch (error) {
    console.error("Error generating PDF:", error.message);
    console.error(error.stack);
    return next(new AppError("Could not generate invoice", 500));
  }
});

export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new AppError("No order found", 400));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getOrdersByUser = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const orders = await Order.find({ user: _id })
    .sort("-createdAt")
    .populate("products")
    .populate("user products.productId")
    .exec();

  if (!orders) {
    return next(new AppError("Orders Empty", 404));
  }
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

const getAllOrdersByAdmin = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate("user");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

const getOrderByUserId = catchAsync(async (req, res, next) => {
  const { _id } = req.body;
  const orders = await Order.find({ user: _id }).populate(
    "user products.product"
  );

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

const updateOrderStatusByAdmin = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("No Order with that ID", 404));
  }

  const { status } = req.body;

  // If status is being updated to Delivered, and paymentMethod is COD, set paymentStatus to Paid
  if (status === "Delivered" && order.paymentMethod === "Cash on Delivery") {
    order.paymentStatus = "Paid";
  }

  // Update the order status and payment status if needed
  order.orderStatus = status;

  await order.save();

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

const getDailyOrders = catchAsync(async (req, res, next) => {
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        orders: { $sum: 1 },
        sales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  console.log(dailyOrders);
  res.status(200).json({
    status: "success",

    data: {
      dailyOrders,
    },
  });
});

const getOrderSummary = catchAsync(async (req, res, next) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const soldProducts = await Product.aggregate([
    {
      $group: {
        _id: null,
        productsSold: { $sum: "$sold" },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);

  const products = await Product.aggregate([
    {
      $group: {
        _id: null,
        numProducts: { $sum: 1 },
      },
    },
  ]);

  const monthlyEarnings = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        earnings: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $facet: {
        last30Days: [
          {
            $match: {
              _id: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          },
        ],
        previous30Days: [
          {
            $match: {
              _id: {
                $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              },
            },
          },
        ],
      },
    },
  ]);

  const productsCreatedByDate = await Product.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date("2023-08-10"),
          $lte: new Date("2023-08-29"),
        },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        numProducts: { $sum: 1 },
      },
    },
    {
      $addFields: { day: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numProducts: -1 },
    },
  ]);

  const productsCreatedByMonth = await Product.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date("2023-06-10"),
          $lte: new Date("2023-09-10"),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        numProducts: { $sum: 1 },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numProducts: -1 },
    },
  ]);

  res.status(200).json({
    status: "success",

    data: {
      noOfUsers: users[0].numUsers,
      noOfProducts: products[0].numProducts,
      productsSold: soldProducts[0].productsSold,
      noOfOrders: orders[0].numOrders,
      revenue: orders[0].totalSales,
    },
  });
});

export const getSalesData = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate);
  if (!startDate || !endDate) {
    return next(new AppError("Please specify start and end dates", 404));
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const salesData = await Order.aggregate([
    {
      $match: {
        saleDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
        totalSales: { $sum: "$finalPrice" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);
  res.status(200).json(salesData);
});

export {
  updateOrderStatusByAdmin,
  getOrderByUserId,
  getOrdersByUser,
  getAllOrdersByAdmin,
  getOrderSummary,
  getDailyOrders,
};
