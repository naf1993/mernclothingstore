import express from 'express';
import { protect, restrictToAdmin } from '../controllers/authController.js';
import { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } from '../controllers/couponController.js';

const router = express.Router();

router.route('/').get(protect,restrictToAdmin,getAllCoupons).post(protect,restrictToAdmin,createCoupon)

router.route('/:id').get(protect,restrictToAdmin,getCouponById).patch(protect,restrictToAdmin,updateCoupon).delete(protect,restrictToAdmin,deleteCoupon)

export default router