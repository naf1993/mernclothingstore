import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModels.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import uniqid from "uniqid";

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

const getOrdersByUser = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const orders = await Order.find({ user: _id })
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
  const orders = await Order.find();

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
  if (!order) {
    return next(new AppError("No Order with that ID", 404));
  }
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      orderStatus: status,
      paymentIntent: {
        status: status,
      },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",

    data: {
      updatedOrder,
    },
  });
});

const getDailyOrders = catchAsync(async(req,res,next)=>{
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
    dailyOrders
    },
  });
})

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
      $group:{
        _id:null,
        productsSold:{$sum:'$sold'}
      }
    }
  ])
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
      productsSold:soldProducts[0].productsSold,
      noOfOrders: orders[0].numOrders, revenue: orders[0].totalSales ,
    },
  });
});

export const getSalesData = catchAsync(async (req, res, next) => {

  const {startDate,endDate} = req.query
  console.log(startDate,endDate)
  if(!startDate || !endDate){
    return next(new AppError("Please specify start and end dates", 404));

  }
  const start = new Date(startDate)
  const end = new Date(endDate)
  const salesData = await Order.aggregate([
    {$match:{
      saleDate:{$gte:start,$lte:end}
    }},
    {
      $group:{
        _id:{$dateToString:{format: '%Y-%m-%d', date: '$saleDate'}},
        totalSales:{$sum:'$finalPrice'},
        totalOrders:{$sum:1}
      }
    },
    {$sort:{_id:-1}}
  ])
  res.status(200).json(salesData)

})

export {
  updateOrderStatusByAdmin,
  getOrderByUserId,
  createCashOrder,
  getOrdersByUser,
  getAllOrdersByAdmin,
  getOrderSummary,
  getDailyOrders
};
