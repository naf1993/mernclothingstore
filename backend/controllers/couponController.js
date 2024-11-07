import Coupon from "../models/couponModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Order from "../models/orderModel.js";

const checkIfFirstOrder = async (userId) => {
  const orders = await Order.find({ user: userId });
  return orders.length === 0;
};
const getAllCoupons = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find();

  res.status(200).json({
    status: "success",
    results: coupons.length,
    data: {
      coupons,
    },
  });
});

const createCoupon = catchAsync(async (req, res, next) => {
  const { code, discount } = req.body;

  const newCoupon = new Coupon({
    code,
    discount,
    // No need to set createdAt or expiresAt manually
  });
  await newCoupon.save();

  res.status(201).json({
    status: "success",
    data: {
      newCoupon,
    },
  });
});

export const validateCoupon = catchAsync(async (req, res, next) => {
  const { userId, couponCode } = req.body;
  const coupon = await Coupon.findOne({ code: couponCode });
  if (!coupon) {
    return next(new AppError("No Coupon found", 404));
  }
  coupon.checkExpiration();
  await coupon.save();
  if (!coupon.isActive) {
    return next(new AppError("Coupon expired", 404));
  }
  const isFirstOrder = await checkIfFirstOrder(userId);
  if (isFirstOrder) {
    return res.json({
      discount: coupon.discount,
    });
  } else {
    return res.json({ message: "coupon applied" });
  }
});

const getCouponById = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id).populate("reviews");
  if (!coupon) {
    return next(new AppError("No Product found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      coupon,
    },
  });
});

const deleteCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    return next(new AppError("No Product found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const updateCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      coupon,
    },
  });
});

export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
