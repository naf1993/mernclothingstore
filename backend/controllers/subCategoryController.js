import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

const createSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});





const getAllSubCategories = catchAsync(async (req, res, next) => {
  const subCategories = await SubCategory.find().populate('Category');

  res.status(200).json({
    status: "success",
    results: subCategories.length,
    data: {
      subCategories,
    },
  });
});




const getSubCategoryById = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return next(new AppError("No category found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
        subCategory,
    },
  });
});




// const getProductStats = catchAsync(async(req,res,next)=>{
//   const stats = await Product.aggregate([
//     {

//     }
//   ])
// })

export {
 
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById
 
};
