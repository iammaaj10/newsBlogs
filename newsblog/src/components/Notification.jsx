import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector(store => store.user);

  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
      // Fetch notifications every minute to check for expired ones
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/notifications/${user._id}`);
      // Filter out notifications older than 1 hour
      const currentTime = new Date();
      const filteredNotifications = response.data.filter(notification => {
        const notificationTime = new Date(notification.createdAt);
        const timeDiff = currentTime - notificationTime;
        return timeDiff < 3600000; // 1 hour in milliseconds
      });
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.fromUser.username} liked your blog "${notification.blog.title}"`;
      case 'comment':
        return `${notification.fromUser.username} commented on your blog "${notification.blog.title}"`;
      case 'follow':
        return `${notification.fromUser.username} started following you`;
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications && notifications.map((notification) => (
            <div
              key={notification?._id}
              className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              onClick={() => {
                // Import and use useNavigate hook at the top level
                const navigate = useNavigate();
                
                // Navigate based on notification type
                if (notification.type === 'like' || notification.type === 'comment') {
                  navigate(`/blog/${notification.blog._id}`);
                } else if (notification.type === 'follow') {
                  navigate(`/profile/${notification.fromUser._id}`);
                }
              }}
            >
              <p className="text-gray-800">
                {getNotificationMessage(notification)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(notification?.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
