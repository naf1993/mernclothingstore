import express from 'express';
import { protect, restrictToAdmin,restrictToUser } from '../controllers/authController.js';
import { addToCart,deleteAllCart,emptyCartByUser,getUserCart,removeItemFromCart,setUserIds, updateCartQuantity } from '../controllers/cartController.js';

const router = express.Router();

router.route('/').post(protect,addToCart).get(protect,getUserCart).delete(protect,emptyCartByUser)
router.route('/deleteitem').post(protect,removeItemFromCart)
router.route('/updateqty').patch(protect,updateCartQuantity)
router.route('/deletemany').delete(protect,restrictToAdmin,deleteAllCart)
export default router