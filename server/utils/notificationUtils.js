const { CreateNotification, CreateSystemNotification } = require("../Controllers/notificationController");

// Create promotional notification
const createPromoNotification = async (userId, promoData) => {
  try {
    await CreateNotification(userId, {
      type: "promo",
      title: promoData.title || "Special Offer!",
      message: promoData.message,
      data: promoData,
      priority: "medium"
    });
  } catch (error) {
    console.error("Error creating promo notification:", error);
  }
};

// Create reminder notification
const createReminderNotification = async (userId, reminderData) => {
  try {
    await CreateNotification(userId, {
      type: "reminder",
      title: reminderData.title || "Reminder",
      message: reminderData.message,
      data: reminderData,
      priority: "high",
      expiresAt: reminderData.expiresAt
    });
  } catch (error) {
    console.error("Error creating reminder notification:", error);
  }
};

// Create system-wide notification
const createSystemWideNotification = async (notificationData) => {
  try {
    await CreateSystemNotification({
      type: "system",
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData,
      priority: "medium"
    });
  } catch (error) {
    console.error("Error creating system-wide notification:", error);
  }
};

// Create journey reminder (24 hours before departure)
const createJourneyReminder = async (userId, bookingData) => {
  try {
    const departureTime = new Date(bookingData.journeyDate);
    departureTime.setHours(parseInt(bookingData.departure.split(':')[0]));
    departureTime.setMinutes(parseInt(bookingData.departure.split(':')[1]));
    
    const reminderTime = new Date(departureTime.getTime() - 24 * 60 * 60 * 1000);
    
    await CreateNotification(userId, {
      type: "reminder",
      title: "Journey Reminder",
      message: `Your journey from ${bookingData.from} to ${bookingData.to} is tomorrow at ${bookingData.departure}. Don't forget to arrive 30 minutes early!`,
      data: {
        bookingId: bookingData.bookingId,
        busId: bookingData.busId,
        journeyDate: bookingData.journeyDate,
        departure: bookingData.departure
      },
      priority: "high",
      expiresAt: departureTime
    });
  } catch (error) {
    console.error("Error creating journey reminder:", error);
  }
};

// Create new route notification
const createNewRouteNotification = async (userId, routeData) => {
  try {
    await CreateNotification(userId, {
      type: "system",
      title: "New Route Available!",
      message: `New route available from ${routeData.from} to ${routeData.to}. Check it out!`,
      data: routeData,
      priority: "medium"
    });
  } catch (error) {
    console.error("Error creating new route notification:", error);
  }
};

// Create maintenance notification
const createMaintenanceNotification = async (userId, maintenanceData) => {
  try {
    await CreateNotification(userId, {
      type: "system",
      title: "Service Update",
      message: maintenanceData.message,
      data: maintenanceData,
      priority: "high"
    });
  } catch (error) {
    console.error("Error creating maintenance notification:", error);
  }
};

module.exports = {
  createPromoNotification,
  createReminderNotification,
  createSystemWideNotification,
  createJourneyReminder,
  createNewRouteNotification,
  createMaintenanceNotification
};
