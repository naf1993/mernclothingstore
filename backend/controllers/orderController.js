import * as dotenv from "dotenv";
import Stripe from "stripe";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModels.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from 'nodemailer'
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_API_KEY);
const sendOrderConfirmationEmail = async(order,email)=>{
  const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASSWORD
    }
  })
  const mailOptions = {
    from:process.env.EMAIL_USER,
    to:email,
    subject:'Order Confirmation',
    text:`Your order ${order.orderId} has been placed succesfully`,
    html:`<h1>Order Confirmation</h1><p>Your order ${order.orderId} has been placed successfully!</p>`
  }
  await transporter.sendMail(mailOptions)
}

// const makePayment = catchAsync(async (req, res) => {
//   const { amount, currency } = req.body; // Assuming you're sending these in the request body

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount, // amount in cents
//       currency,
//       payment_method_types: ["card"], // Adjust if you support other methods
//     });

//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).json({ error: "Payment failed" });
//   }
// });

export const createOrder = catchAsync(async (req, res, next) => {
  const { userId, products, address, paymentMethod } = req.body;
 const userordered = await User.findById(userId)

  const orderId = `ORD${uuidv4().slice(0, 8).toUpperCase()}`;
  const totalPrice = products.reduce(
    (acc, item) => acc + item.count * item.price,
    0
  );
  const order = await Order.create({
    orderId,
    user: userId,
    products,
    address,
    paymentMethod,
    totalPrice,
    discountCode,
  });
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock -= item.count;
      if (product.countInStock < 5) {
        return next(
          new AppError(`Not enough stock for product ${product.name}`)
        );
      }
      await product.save();
    }
  }
  if (paymentMethod === "Cash on Delivery") {
    return res.status(201).json({
      status: "success",
      data: {
        order,
        message: "Order created succesfully",
      },
    });
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: "usd",
    payment_method_types: ["card"],
  });
  const userMail = userordered.email
  await sendOrderConfirmationEmail(order,userMail)
  const notification = {
    user: req.user._id,
    message: `New Order places : ${user.name}`,
    type: "order_places",
  };
  req.io.emit("notification", notification);
  res.status(201).json({
    status: "success",
    data: {
      order,
      clientSecret: paymentIntent.client_secret,
    },
  });
});

const createCashOrder = catchAsync(async (req, res, next) => {
  const { COD, couponApplied } = req.body;
  if (!COD) {
    return next(new AppError("Cash on Delivery failed", 404));
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User found with that ID", 404));
  }
  const userCart = await Cart.findOne({ user: user._id });
  let finalAmount = 0;
  if (couponApplied ** userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount;
  } else {
    finalAmount = userCart.cartTotal;
  }
  let newOrder = await new Order({
    products: userCart.products,
    address: req.body.address,
    totalPrice: finalAmount,
    paymentIntent: {
      id: uniqid(),
      method: "COD",
      amount: finalAmount,
      status: "Cash on Delivery",
      created: Date.now(),
      currency: "usd",
    },
    user: user._id,
    orderStatus: "Cash on Delivery",
  }).save();

  let update = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { countInStock: -item.count, sold: +item.count } },
      },
    };
  });
  const updated = await Product.bulkWrite(update, {});
  res.status(201).json({
    status: "success",
    data: {
      newOrder,
    },
  });
});

export const getSingleOrder = catchAsync(async(req,res,next)=>{
  console.log(req.params.id)
  const order = await Order.findById(req.params.id).populate('user').populate('products')
  if(!order){
    return next(new AppError("No order found", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });

})
export const deleteOrder = catchAsync(async(req,res,next)=>{
  const order = await Order.findByIdAndDelete(req.params.id)
  if(!order){
    return next(new AppError("No order found", 400));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
})


const getOrdersByUser = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const orders = await Order.find({ user: _id }).populate('products')
    .populate("user products.product")
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

  const { status } = req.body;
  console.log(status);
  if (!order) {
    return next(new AppError("No Order with that ID", 404));
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: status },
    { new: true }
  );
  console.log(updatedOrder);
  res.status(200).json({
    status: "success",

    data: {
      updatedOrder,
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
  createCashOrder,
  getOrdersByUser,
  getAllOrdersByAdmin,
  getOrderSummary,
  getDailyOrders,
};
