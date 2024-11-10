import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";


const createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

const createSubCategory = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});



const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find().populate('subcategories').limit(6);

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});

const getAllSubCategories = catchAsync(async (req, res, next) => {
  const subCategories = await SubCategory.find();

  res.status(200).json({
    status: "success",
    results: subCategoriesategories.length,
    data: {
      subCategories,
    },
  });
});


const getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('subcategories');
  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
        category,
       
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

const updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
        category,
    },
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("No Category found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// const getProductStats = catchAsync(async(req,res,next)=>{
//   const stats = await Product.aggregate([
//     {

//     }
//   ])
// })

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById
 
};
