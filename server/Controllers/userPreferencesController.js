const UserPreferences = require("../models/userPreferencesModel");

// Get user preferences
const GetUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    let preferences = await UserPreferences.findOne({ user: userId });

    // Create default preferences if none exist
    if (!preferences) {
      preferences = new UserPreferences({ user: userId });
      await preferences.save();
    }

    res.status(200).json({
      success: true,
      message: "User preferences retrieved successfully",
      data: preferences
    });
  } catch (error) {
    console.error("Error getting user preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user preferences",
      error: error.message
    });
  }
};

// Update user preferences
const UpdateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove user field from update data to prevent unauthorized changes
    delete updateData.user;

    const preferences = await UserPreferences.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "User preferences updated successfully",
      data: preferences
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user preferences",
      error: error.message
    });
  }
};

// Update specific notification setting
const UpdateNotificationSetting = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, type, enabled } = req.body;

    if (!category || !type || typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters. Required: category, type, enabled"
      });
    }

    const updatePath = `notifications.${category}.types.${type}`;
    const preferences = await UserPreferences.findOneAndUpdate(
      { user: userId },
      { [updatePath]: enabled },
      { new: true, runValidators: true }
    );

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: "User preferences not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification setting updated successfully",
      data: preferences
    });
  } catch (error) {
    console.error("Error updating notification setting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification setting",
      error: error.message
    });
  }
};

// Toggle notification category
const ToggleNotificationCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, enabled } = req.body;

    if (!category || typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters. Required: category, enabled"
      });
    }

    const updatePath = `notifications.${category}.enabled`;
    const preferences = await UserPreferences.findOneAndUpdate(
      { user: userId },
      { [updatePath]: enabled },
      { new: true, runValidators: true }
    );

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: "User preferences not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification category toggled successfully",
      data: preferences
    });
  } catch (error) {
    console.error("Error toggling notification category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle notification category",
      error: error.message
    });
  }
};

// Update quiet hours
const UpdateQuietHours = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled, start, end } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters. Required: enabled (boolean)"
      });
    }

    const updateData = { 'quietHours.enabled': enabled };
    if (start) updateData['quietHours.start'] = start;
    if (end) updateData['quietHours.end'] = end;

    const preferences = await UserPreferences.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: "User preferences not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiet hours updated successfully",
      data: preferences
    });
  } catch (error) {
    console.error("Error updating quiet hours:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update quiet hours",
      error: error.message
    });
  }
};

// Reset user preferences to defaults
const ResetUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const preferences = await UserPreferences.findOneAndUpdate(
      { user: userId },
      {
        $unset: {
          notifications: 1,
          quietHours: 1,
          language: 1,
          timezone: 1,
          frequency: 1
        }
      },
      { new: true }
    );

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: "User preferences not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User preferences reset to defaults successfully",
      data: preferences
    });
  } catch (error) {
    console.error("Error resetting user preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset user preferences",
      error: error.message
    });
  }
};

module.exports = {
  GetUserPreferences,
  UpdateUserPreferences,
  UpdateNotificationSetting,
  ToggleNotificationCategory,
  UpdateQuietHours,
  ResetUserPreferences
};
