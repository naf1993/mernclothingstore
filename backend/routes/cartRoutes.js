import express from 'express';
import { protect, restrictToAdmin,restrictToUser } from '../controllers/authController.js';
import { addToCart,deleteAllCart,emptyCartByUser,getUserCart,removeItemFromCart,setUserIds } from '../controllers/cartController.js';

const router = express.Router();

router.route('/').post(protect,restrictToUser,addToCart).get(protect,restrictToUser,getUserCart).delete(protect,restrictToUser,emptyCartByUser)
router.route('/deleteitem').delete(protect,restrictToUser,removeItemFromCart)
router.route('/deletemany').delete(protect,restrictToAdmin,deleteAllCart)
export default router