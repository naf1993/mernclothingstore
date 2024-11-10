import express from 'express';
import {  login, protect,  restrictToAdmin } from '../controllers/authController.js';
import { addToWishList, createProduct, deleteProduct ,getAllProducts, getProductById, getProductStatistics, getProductsByCategory, getProductsBySubCategory, getSimilarProducts, productSearch, updateProduct, upload, resizeImages, deleteImageFromProduct, topSellingProducts, bulkUpdateProductStock, productsSearchByName } from '../controllers/productController.js';
import { getSoldProductCount,getAllColorsOfAllProducts } from '../controllers/productController.js';
import reviewRoutes from './reviewRoutes.js'

const router = express.Router();

router.use('/:productId/reviews',reviewRoutes)
router.get('/getProductByCategory',getProductsByCategory)
router.route('/bulk-update-stock').post(protect,restrictToAdmin,bulkUpdateProductStock)
router.get('/getProductBySubCategory',getProductsBySubCategory)
router.get("/relatedproducts/:productId/:categoryId", getSimilarProducts);
router.route('/getproductstats').get(getProductStatistics)
router.route('/search').get(productsSearchByName)
router.route('/allcolors').get(getAllColorsOfAllProducts)
router.route('/images/').delete(protect,restrictToAdmin,deleteImageFromProduct)
router.route('/top-selling').get(protect,restrictToAdmin,topSellingProducts)
router.route('/').get(getAllProducts).post(protect,restrictToAdmin,upload,resizeImages,createProduct)
router.route('/:id').get(getProductById).patch(protect,restrictToAdmin,upload,resizeImages,updateProduct).delete(protect,restrictToAdmin,deleteProduct)
router.put('/wishlist',protect,addToWishList)

router.route('/getproductcount').get(getSoldProductCount)

export default router