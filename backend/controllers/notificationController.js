import Notification from "../models/notificationModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllNotificationsByAdmin = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find();

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

export const markReadNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    return next(new AppError("No Notifcation found with that ID", 404));
  }
  res.status(200).json({
    status: "success",

    data: {
      notification,
    },
  });
});

export const newNotification = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const { message, type } = req.body;
  const notification = new Notification({ user, message, type });
  await notification.save();
  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  });
});
