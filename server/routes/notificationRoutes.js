const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  GetUserNotifications,
  MarkNotificationAsRead,
  MarkAllNotificationsAsRead,
  DeleteNotification,
  GetUnreadCount,
} = require("../Controllers/notificationController");

// Get user notifications with pagination
router.get("/", authMiddleware, GetUserNotifications);

// Get unread count
router.get("/unread-count", authMiddleware, GetUnreadCount);

// Mark notification as read
router.patch("/:notificationId/read", authMiddleware, MarkNotificationAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", authMiddleware, MarkAllNotificationsAsRead);

// Delete notification
router.delete("/:notificationId", authMiddleware, DeleteNotification);

module.exports = router;
