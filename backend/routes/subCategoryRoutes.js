import express from 'express';
import {   protect, restrictToAdmin} from '../controllers/authController.js';
import {getAllSubCategories,getSubCategoryById,createSubCategory} from '../controllers/subCategoryController.js'
//import reviewRoutes from './reviewRoutes.js'
const router = express.Router();

router.use(protect)
router.use(restrictToAdmin)

router.route('/').get(getAllSubCategories).post(createSubCategory)
router.route('/:id').get(getSubCategoryById)


export default router