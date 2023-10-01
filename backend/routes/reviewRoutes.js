import express from 'express';
import { protect, restrictToAdmin,restrictToUser } from '../controllers/authController.js';
import { createReview, deleteReview, getAllReviews, getReviewById, setProductUserIds, updateReview, updateReviewByUser } from '../controllers/reviewController.js';

const router = express.Router({mergeParams:true});

router.route('/').get(protect,restrictToAdmin,getAllReviews).post(protect,restrictToUser,setProductUserIds,createReview)

router.route('/:id').get(getReviewById).delete(protect,deleteReview)
router.route('/:id').patch(protect,restrictToUser,setProductUserIds,updateReview)
export default router