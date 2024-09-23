import express from 'express';
import {  login, protect, register, resetPassword, restrictToAdmin, updatePassword } from '../controllers/authController.js';
import { addToWishList, createProduct, deleteProduct ,getAllProducts, getProductById, getProductStatistics, getProductsByCategory, getProductsBySubCategory, getSimilarProducts, productSearch, updateProduct, upload, resizeImages } from '../controllers/productController.js';
import { getSoldProductCount,getAllColorsOfAllProducts } from '../controllers/productController.js';
import reviewRoutes from './reviewRoutes.js'

const router = express.Router();

router.use('/:productId/reviews',reviewRoutes)
router.get('/getProductByCategory',getProductsByCategory)
router.get('/getProductBySubCategory',getProductsBySubCategory)
router.get("/relatedproducts/:productId/:categoryId", getSimilarProducts);
router.route('/getproductstats').get(getProductStatistics)
router.route('/search/:keyword').get(productSearch)
router.route('/allcolors').get(getAllColorsOfAllProducts)

router.route('/').get(getAllProducts).post(protect,restrictToAdmin,upload,resizeImages,createProduct)
router.route('/:id').get(getProductById).patch(protect,restrictToAdmin,updateProduct).delete(protect,restrictToAdmin,deleteProduct)
router.put('/wishlist',protect,addToWishList)

router.route('/getproductcount').get(getSoldProductCount)

export default router