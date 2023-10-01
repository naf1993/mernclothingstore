import express from 'express';
import { protect, restrictToAdmin,restrictToUser } from '../controllers/authController.js';

import { createCashOrder, getAllOrdersByAdmin, getDailyOrders, getOrderByUserId, getOrderSummary, getOrdersByUser, updateOrderStatusByAdmin } from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(protect,restrictToUser,createCashOrder).get(protect,restrictToAdmin,getAllOrdersByAdmin)

router.route('/getMyOrders').get(protect,restrictToUser,getOrdersByUser)
// router.route('/:id').get(getReviewById).patch(protect,restrictToUser,updateReview).delete(protect,deleteReview)
router.route('/:userid/getOrderById').get(protect,restrictToAdmin,getOrderByUserId)
router.route('/:id/updateOrder').put(protect,restrictToAdmin,updateOrderStatusByAdmin)
router.route('/getordersummary').get(protect,restrictToAdmin,getOrderSummary)
router.route('/getdailyorders').get(protect,restrictToAdmin,getDailyOrders)
export default router