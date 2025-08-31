import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NotificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20, unreadOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await NotificationService.getUserNotifications(page, limit, unreadOnly);
      
      if (page === 1) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.data.notifications]);
      }
      
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
        hasMore: response.data.hasMore
      });
    } catch (error) {
      setError(error.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await NotificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
      
      // Update unread count if notification was unread
      const deletedNotification = notifications.find(n => n._id === notificationId);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }, [notifications]);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      fetchNotifications(pagination.currentPage + 1, 20, false);
    }
  }, [pagination.hasMore, pagination.currentPage, loading, fetchNotifications]);

  // Refresh notifications
  const refresh = useCallback(() => {
    fetchNotifications(1, 20, false);
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Initialize notifications and real-time updates
  useEffect(() => {
    fetchNotifications(1, 20, false);
    fetchUnreadCount();

    // Subscribe to real-time updates
    const unsubscribe = NotificationService.subscribeToNotifications((count) => {
      // If unread count increases, refresh list automatically
      setUnreadCount((prev) => {
        if (typeof prev === 'number' && count > prev) {
          // Fetch latest notifications (first page)
          fetchNotifications(1, 20, false);
        }
        return count;
      });
    });

    return unsubscribe;
  }, [fetchNotifications, fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
