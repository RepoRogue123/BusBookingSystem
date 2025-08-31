import { axiosInstance } from '../helpers/axiosInstance';

class NotificationService {
  // Get user notifications with pagination
  static async getUserNotifications(page = 1, limit = 20, unreadOnly = false) {
    try {
      const response = await axiosInstance.get('/api/notifications', {
        params: { page, limit, unreadOnly }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount() {
    try {
      const response = await axiosInstance.get('/api/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const response = await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    try {
      const response = await axiosInstance.patch('/api/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId) {
    try {
      const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Subscribe to real-time updates (WebSocket)
  static subscribeToNotifications(callback) {
    // In a real app, this would use WebSocket or Server-Sent Events
    // For now, we'll use faster polling as a fallback
    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      try {
        const response = await this.getUnreadCount();
        if (!cancelled) callback(response.data.count);
      } catch (error) {
        console.error('Error in notification polling:', error);
      }
    };

    // Immediate tick for faster first update
    tick();
    const interval = setInterval(tick, 5000); // Poll every 5 seconds

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }
}

export default NotificationService;
