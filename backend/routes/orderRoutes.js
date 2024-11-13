import express from 'express';
import { protect, restrictToAdmin,restrictToUser } from '../controllers/authController.js';

import { bulkUpdateOrders, createCashOrder, deleteOrder, generateInvoiceSingle, getAllOrdersByAdmin, getDailyOrders, getOrderByUserId, getOrderSummary, getOrdersByUser, getPaymentIntent, getSalesData, getSingleOrder, updateOrderStatusByAdmin } from '../controllers/orderController.js';

const router = express.Router();

router.route('/create-payment-intent').post(protect,getPaymentIntent)
router.route('/getMyOrders').get(protect,getOrdersByUser)
router.route('/getordersummary').get(protect,restrictToAdmin,getOrderSummary)
router.route('/bulk-action').post(protect,restrictToAdmin,bulkUpdateOrders)
router.route('/generate-invoice/:orderId?').get(protect,restrictToAdmin,generateInvoiceSingle)
router.route('/getdailyorders').get(protect,restrictToAdmin,getDailyOrders)
router.route('/sales').get(protect,restrictToAdmin,getSalesData)


router.route('/').post(protect,restrictToUser,createCashOrder).get(protect,restrictToAdmin,getAllOrdersByAdmin)
router.route('/:id').get(protect,getSingleOrder).delete(protect,restrictToAdmin,deleteOrder)


// router.route('/:id').get(getReviewById).patch(protect,restrictToUser,updateReview).delete(protect,deleteReview)
router.route('/:userid/getOrderById').get(protect,restrictToAdmin,getOrderByUserId)
router.route('/:id/updateOrder').patch(protect,restrictToAdmin,updateOrderStatusByAdmin)

export default router