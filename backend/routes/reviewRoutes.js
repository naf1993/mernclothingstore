import express from 'express';
import { protect, restrictToAdmin,restrictToUser } from '../controllers/authController.js';
import { createReview, deleteReview, getAllReviews, getReviewById, setProductUserIds, updateReview, checkReviewCreateEligible } from '../controllers/reviewController.js'

const router = express.Router({mergeParams:true});

router.route('/:productId').get(protect,checkReviewCreateEligible)
router.route('/').get(protect,restrictToAdmin,getAllReviews).post(protect,createReview)

router.route('/:id').get(getReviewById).delete(protect,deleteReview)
router.route('/:id').patch(protect,restrictToUser,setProductUserIds,updateReview)
export default router