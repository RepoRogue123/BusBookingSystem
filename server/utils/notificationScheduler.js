const cron = require('node-cron');
const Booking = require('../models/bookingsModel');
const { createJourneyReminder } = require('./notificationUtils');

// Schedule journey reminders (runs every hour)
const scheduleJourneyReminders = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running journey reminder scheduler...');
      
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      // Find bookings for tomorrow
      const tomorrowBookings = await Booking.find({
        journeyDate: {
          $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
          $lt: new Date(tomorrow.setHours(23, 59, 59, 999))
        }
      }).populate('bus user');
      
      for (const booking of tomorrowBookings) {
        // Check if reminder already exists
        const existingReminder = await require('../models/notificationModel').findOne({
          user: booking.user._id,
          type: 'reminder',
          'data.bookingId': booking._id,
          'data.journeyDate': booking.bus.journeyDate
        });
        
        if (!existingReminder) {
          await createJourneyReminder(booking.user._id, {
            bookingId: booking._id,
            busId: booking.bus._id,
            from: booking.bus.from,
            to: booking.bus.to,
            journeyDate: booking.bus.journeyDate,
            departure: booking.bus.departure
          });
        }
      }
      
      console.log(`Processed ${tomorrowBookings.length} journey reminders`);
    } catch (error) {
      console.error('Error in journey reminder scheduler:', error);
    }
  });
};

// Schedule promotional notifications (runs daily at 9 AM)
const schedulePromotionalNotifications = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('Running promotional notification scheduler...');
      
      // This would typically fetch from a promotions database
      // For now, we'll create a sample promotional notification
      const User = require('../models/usersModel');
      const users = await User.find({}, '_id');
      
      for (const user of users) {
        // Random promotional content
        const promoMessages = [
          {
            title: "Weekend Special!",
            message: "Get 15% off on all weekend journeys. Use code WEEKEND15 at checkout!"
          },
          {
            title: "Early Bird Discount",
            message: "Book your tickets 7 days in advance and save 20% on your journey!"
          },
          {
            title: "Student Discount",
            message: "Students get 25% off on all routes. Don't forget to verify your student ID!"
          }
        ];
        
        const randomPromo = promoMessages[Math.floor(Math.random() * promoMessages.length)];
        
        await require('./notificationUtils').createPromoNotification(user._id, randomPromo);
      }
      
      console.log(`Sent promotional notifications to ${users.length} users`);
    } catch (error) {
      console.error('Error in promotional notification scheduler:', error);
    }
  });
};

// Schedule system maintenance notifications (runs weekly on Sunday at 6 AM)
const scheduleMaintenanceNotifications = () => {
  cron.schedule('0 6 * * 0', async () => {
    try {
      console.log('Running maintenance notification scheduler...');
      
      // This would typically check for scheduled maintenance
      // For now, we'll create a sample maintenance notification
      const User = require('../models/usersModel');
      const users = await User.find({}, '_id');
      
      for (const user of users) {
        await require('./notificationUtils').createMaintenanceNotification(user._id, {
          title: "Weekly System Update",
          message: "Our system will undergo maintenance every Sunday from 2 AM to 4 AM. During this time, booking services may be temporarily unavailable."
        });
      }
      
      console.log(`Sent maintenance notifications to ${users.length} users`);
    } catch (error) {
      console.error('Error in maintenance notification scheduler:', error);
    }
  });
};

// Initialize all schedulers
const initializeNotificationSchedulers = () => {
  console.log('Initializing notification schedulers...');
  
  scheduleJourneyReminders();
  schedulePromotionalNotifications();
  scheduleMaintenanceNotifications();
  
  console.log('Notification schedulers initialized successfully');
};

module.exports = {
  initializeNotificationSchedulers,
  scheduleJourneyReminders,
  schedulePromotionalNotifications,
  scheduleMaintenanceNotifications
};
