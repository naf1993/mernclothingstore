import Review from "../models/reviewModel.js";
import catchAsync from "../utils/catchAsync.js";

import AppError from "../utils/appError.js";
import Product from "../models/productModel.js";
const setProductUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const checkReviewCreateEligible = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const order = await OrderSuccess.findOne({
    user: userId,
    "products.productId": productId,
    orderStatus: "Delivered",
  });
  if (!order) {
    res.status(400).json({
      data: {
        eligible: false,
      },
    });
  }
  res.status(200).json({
    data: {
      eligible: true,
    },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const { productId, review, rating } = re.body;
  const userId = req.user._id;
  const order = await OrderSuccess.findOne({
    user: userId,
    "products.productId": productId,
    orderStatus: "Delivered",
  });
  if (!order) {
    return next(
      new AppError(
        "You can only leave a review for a product once delivered",
        404
      )
    );
  }

  const existingReview = await Review.findOne({
    product: productId,
    user: userId,
  });
  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 404));
  }
  const newReview = await Review.create({
    review,
    rating,
    product: productId,
    user: userId,
  });
  const product = await Product.findById(productId);
  product.ratingsQuantity += 1;
  product.ratingsAverage =
    (product.ratingsAverage * (product.ratingsQuantity - 1) + rating) /
    product.ratingsQuantity;
  await product.save();
  res.status(201).json({
    status: "success",

    data: {
      newReview,
    },
  });
});
const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError("No Product found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError("No Product found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const updateReviewByUser = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);
});

export {
  updateReviewByUser,
  setProductUserIds,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
