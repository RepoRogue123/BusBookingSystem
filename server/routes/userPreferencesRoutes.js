const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  GetUserPreferences,
  UpdateUserPreferences,
  UpdateNotificationSetting,
  ToggleNotificationCategory,
  UpdateQuietHours,
  ResetUserPreferences,
} = require("../Controllers/userPreferencesController");

// Get user preferences
router.get("/", authMiddleware, GetUserPreferences);

// Update user preferences
router.put("/", authMiddleware, UpdateUserPreferences);

// Update specific notification setting
router.patch("/notification-setting", authMiddleware, UpdateNotificationSetting);

// Toggle notification category
router.patch("/toggle-category", authMiddleware, ToggleNotificationCategory);

// Update quiet hours
router.patch("/quiet-hours", authMiddleware, UpdateQuietHours);

// Reset user preferences to defaults
router.delete("/reset", authMiddleware, ResetUserPreferences);

module.exports = router;
