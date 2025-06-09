import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSocket } from "./SocketProvider"; // Fixed import path

// 1. Create context
export const NotificationContext = createContext(null);

// 2. Custom hook for easy usage
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// 3. Provider component
const NotificationProvider = ({ children }) => {
  const { socket, isConnected } = useSocket(); // Use the hook instead of direct context
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const mountedRef = useRef(true);

  // Safe state update helper
  const safeSetState = useCallback((setter, value) => {
    if (mountedRef.current) {
      setter(value);
    }
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("Socket not available or not connected for notifications");
      return;
    }

    console.log("Setting up notification listeners");

    // Handle incoming notifications
    const handleNotification = (data) => {
      try {
        console.log("📩 Received Notification:", data);
        
        if (data && mountedRef.current) {
          safeSetState(setNotifications, (prev) => {
            // Avoid duplicates by checking if notification already exists
            const exists = prev.some(notif => 
              notif._id === data._id || 
              (notif.timestamp === data.timestamp && notif.type === data.type)
            );
            
            if (!exists) {
              return [{ ...data, isRead: false, receivedAt: new Date() }, ...prev];
            }
            return prev;
          });
          
          // Update unread count
          safeSetState(setUnreadCount, (prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error handling notification:", error);
      }
    };

    // Handle notification updates (like mark as read)
    const handleNotificationUpdate = (data) => {
      try {
        console.log("🔄 Notification Update:", data);
        
        if (data && mountedRef.current) {
          safeSetState(setNotifications, (prev) =>
            prev.map(notif =>
              notif._id === data.notificationId
                ? { ...notif, isRead: data.isRead }
                : notif
            )
          );
          
          if (data.isRead) {
            safeSetState(setUnreadCount, (prev) => Math.max(0, prev - 1));
          }
        }
      } catch (error) {
        console.error("Error handling notification update:", error);
      }
    };

    // Handle bulk notification operations
    const handleBulkNotificationUpdate = (data) => {
      try {
        console.log("📦 Bulk Notification Update:", data);
        
        if (data && mountedRef.current) {
          if (data.action === 'markAllAsRead') {
            safeSetState(setNotifications, (prev) =>
              prev.map(notif => ({ ...notif, isRead: true }))
            );
            safeSetState(setUnreadCount, 0);
          } else if (data.action === 'clearAll') {
            safeSetState(setNotifications, []);
            safeSetState(setUnreadCount, 0);
          }
        }
      } catch (error) {
        console.error("Error handling bulk notification update:", error);
      }
    };

    // Set up listeners
    socket.on("receive-notification", handleNotification);
    socket.on("receiveNotification", handleNotification); // Alternative event name
    socket.on("notification-update", handleNotificationUpdate);
    socket.on("bulk-notification-update", handleBulkNotificationUpdate);

    // Cleanup listeners
    return () => {
      console.log("Cleaning up notification listeners");
      socket.off("receive-notification", handleNotification);
      socket.off("receiveNotification", handleNotification);
      socket.off("notification-update", handleNotificationUpdate);
      socket.off("bulk-notification-update", handleBulkNotificationUpdate);
    };
  }, [socket, isConnected, safeSetState]);

  // Helper functions
  const clearNotifications = useCallback(() => {
    safeSetState(setNotifications, []);
    safeSetState(setUnreadCount, 0);
    
    // Optionally emit to server
    if (socket && isConnected) {
      try {
        socket.emit('clear-notifications');
      } catch (error) {
        console.error('Error clearing notifications on server:', error);
      }
    }
  }, [socket, isConnected, safeSetState]);

  const markAsRead = useCallback((notificationId) => {
    safeSetState(setNotifications, (prev) =>
      prev.map(notif =>
        notif._id === notificationId || notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
    
    safeSetState(setUnreadCount, (prev) => Math.max(0, prev - 1));
    
    // Emit to server
    if (socket && isConnected) {
      try {
        socket.emit('mark-notification-read', { notificationId });
      } catch (error) {
        console.error('Error marking notification as read on server:', error);
      }
    }
  }, [socket, isConnected, safeSetState]);

  const markAllAsRead = useCallback(() => {
    safeSetState(setNotifications, (prev) =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    safeSetState(setUnreadCount, 0);
    
    // Emit to server
    if (socket && isConnected) {
      try {
        socket.emit('mark-all-notifications-read');
      } catch (error) {
        console.error('Error marking all notifications as read on server:', error);
      }
    }
  }, [socket, isConnected, safeSetState]);

  const removeNotification = useCallback((notificationId) => {
    safeSetState(setNotifications, (prev) => {
      const filtered = prev.filter(notif => 
        notif._id !== notificationId && notif.id !== notificationId
      );
      return filtered;
    });
    
    // Update unread count if the removed notification was unread
    safeSetState(setNotifications, (prev) => {
      const removedNotif = prev.find(notif => 
        notif._id === notificationId || notif.id === notificationId
      );
      if (removedNotif && !removedNotif.isRead) {
        safeSetState(setUnreadCount, (count) => Math.max(0, count - 1));
      }
      return prev;
    });
    
    // Emit to server
    if (socket && isConnected) {
      try {
        socket.emit('remove-notification', { notificationId });
      } catch (error) {
        console.error('Error removing notification on server:', error);
      }
    }
  }, [socket, isConnected, safeSetState]);

  const addNotification = useCallback((notification) => {
    if (notification && mountedRef.current) {
      const newNotification = {
        ...notification,
        _id: notification._id || notification.id || Date.now().toString(),
        isRead: false,
        receivedAt: new Date()
      };
      
      safeSetState(setNotifications, (prev) => [newNotification, ...prev]);
      safeSetState(setUnreadCount, (prev) => prev + 1);
    }
  }, [safeSetState]);

  // Get filtered notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notif => !notif.isRead);
  }, [notifications]);

  const getReadNotifications = useCallback(() => {
    return notifications.filter(notif => notif.isRead);
  }, [notifications]);

  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(notif => notif.type === type);
  }, [notifications]);

  // Context value
  const value = {
    // State
    notifications,
    unreadCount,
    
    // Actions
    clearNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    
    // Getters
    getUnreadNotifications,
    getReadNotifications,
    getNotificationsByType,
    
    // Connection state
    isConnected: socket && isConnected,
    hasSocket: !!socket
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;