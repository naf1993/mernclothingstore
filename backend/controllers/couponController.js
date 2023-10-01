import Coupon from "../models/couponModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

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
    const coupon = await Coupon.create(req.body);
  
    res.status(201).json({
      status: "success",
      data: {
        coupon,
      },
    });
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
    createCoupon,getAllCoupons,getCouponById,updateCoupon,deleteCoupon
  }
  
  