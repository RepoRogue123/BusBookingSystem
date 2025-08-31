const Notification = require("../models/notificationModel");

// Get all notifications for a user
const GetUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const userId = req.user.id;

    let query = { user: userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: {
        notifications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications",
      error: error.message
    });
  }
};

// Mark notification as read
const MarkNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message
    });
  }
};

// Mark all notifications as read
const MarkAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message
    });
  }
};

// Delete notification
const DeleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message
    });
  }
};

// Get unread count
const GetUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      user: userId,
      read: false
    });

    res.status(200).json({
      success: true,
      message: "Unread count retrieved",
      data: { count }
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message
    });
  }
};

// Create notification (for internal use)
const CreateNotification = async (userId, notificationData) => {
  try {
    const notification = new Notification({
      user: userId,
      ...notificationData
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Create system notification for all users
const CreateSystemNotification = async (notificationData) => {
  try {
    const User = require("../models/usersModel");
    const users = await User.find({}, '_id');
    
    const notifications = users.map(user => ({
      user: user._id,
      ...notificationData
    }));

    await Notification.insertMany(notifications);
    return notifications;
  } catch (error) {
    console.error("Error creating system notification:", error);
    throw error;
  }
};

module.exports = {
  GetUserNotifications,
  MarkNotificationAsRead,
  MarkAllNotificationsAsRead,
  DeleteNotification,
  GetUnreadCount,
  CreateNotification,
  CreateSystemNotification
};
