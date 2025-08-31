const mongoose = require("mongoose");

const userPreferencesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    notifications: {
      email: {
        enabled: { type: Boolean, default: true },
        types: {
          booking: { type: Boolean, default: true },
          system: { type: Boolean, default: true },
          promo: { type: Boolean, default: true },
          reminder: { type: Boolean, default: true },
        },
      },
      push: {
        enabled: { type: Boolean, default: true },
        types: {
          booking: { type: Boolean, default: true },
          system: { type: Boolean, default: true },
          promo: { type: Boolean, default: true },
          reminder: { type: Boolean, default: true },
        },
      },
      inApp: {
        enabled: { type: Boolean, default: true },
        types: {
          booking: { type: Boolean, default: true },
          system: { type: Boolean, default: true },
          promo: { type: Boolean, default: true },
          reminder: { type: Boolean, default: true },
        },
      },
    },
    quietHours: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: "22:00" }, // 10 PM
      end: { type: String, default: "08:00" },   // 8 AM
    },
    language: {
      type: String,
      default: "en",
      enum: ["en", "hi", "mr", "gu"], // English, Hindi, Marathi, Gujarati
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    frequency: {
      type: String,
      default: "immediate",
      enum: ["immediate", "hourly", "daily", "weekly"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
userPreferencesSchema.index({ user: 1 });

module.exports = mongoose.model("userPreferences", userPreferencesSchema);
