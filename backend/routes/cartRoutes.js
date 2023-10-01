import express from 'express';
import { protect, restrictToAdmin,restrictToUser } from '../controllers/authController.js';
import { addToCart,emptyCartByUser,getUserCart,setUserIds } from '../controllers/cartController.js';

const router = express.Router();

router.route('/').post(protect,restrictToUser,addToCart).get(protect,restrictToUser,getUserCart).delete(protect,restrictToUser,emptyCartByUser)


export default router