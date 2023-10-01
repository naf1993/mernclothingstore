import Review from "../models/reviewModel.js";
import catchAsync from "../utils/catchAsync.js";

const setProductUserIds = (req,res,next)=>{
    if(!req.body.product) req.body.product =  req.params.productId
    if(!req.body.user) req.body.user = req.user.id
    next()
}



const createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create(req.body);
  
    res.status(201).json({
      status: "success",
      data: {
        review,
      },
    });
  });
  
  const getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find()

    res.status(200).json({
        status:'success',
        results:reviews.length,
        data:{
            reviews
        }
    })
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

  const updateReviewByUser = catchAsync(async(req,res,next)=>{
   const {_id} = req.user
   console.log(_id)
  })

  export {updateReviewByUser,createReview,setProductUserIds,getAllReviews,getReviewById,updateReview,deleteReview}