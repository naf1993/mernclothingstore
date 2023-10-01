import express from 'express';
import {   protect, restrictToAdmin} from '../controllers/authController.js';
import {createCategory,updateCategory,deleteCategory,getAllCategories,getCategoryById,getAllSubCategories,getSubCategoryById,createSubCategory} from '../controllers/categoryController.js'
//import reviewRoutes from './reviewRoutes.js'
import { uploadCoverImage,resizeCoverImage } from '../utils/uploads.js';
const router = express.Router();


router.route('/').get(getAllCategories)
router.route('/:id').get(getCategoryById)
router.use(protect)
router.use(restrictToAdmin)

router.route('/').post(createCategory)
router.route('/:id').patch(uploadCoverImage,resizeCoverImage,updateCategory).delete(deleteCategory)


router.route('/subcategory').get(getAllSubCategories).post(createSubCategory)
router.route('/subcategory/:id').get(getSubCategoryById)
export default router