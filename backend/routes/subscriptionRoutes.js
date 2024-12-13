import express from 'express';
import { addSubscription } from '../controllers/subscriptionController.js';

const router = express.Router();

router.route('/subscribe').post(addSubscription)
export default router