import express from "express";
import { protect, restrictToAdmin } from "../controllers/authController.js";
import {getAllNotificationsByAdmin,markReadNotification,newNotification} from '../controllers/notificationController.js'
const router = express.Router();

router.use(protect);
router.use(restrictToAdmin);

router.route('/').get(getAllNotificationsByAdmin).post(newNotification)
router.route('/:id').put(markReadNotification)

export default router