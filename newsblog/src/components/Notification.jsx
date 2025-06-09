import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotification } from '../context/NotificationContext'; // import real-time context

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const { notifications: socketNotifications } = useNotification(); // access socket notifications

  // Combine socket and API notifications
  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    // Merge socket notifications with the fetched ones
    const allNotifications = [...socketNotifications, ...notifications];
    const uniqueNotifications = Array.from(new Map(allNotifications.map(n => [n._id, n])).values());
    setNotifications(uniqueNotifications);
  }, [socketNotifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_API_END_POINT}/notifications/${user._id}`);
      const notificationsData = Array.isArray(response.data) ? response.data : [];
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
      setNotifications([]); // Set to an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      default:
        return '📢';
    }
  };

  const getNotificationMessage = (notification) => {
    const fromUser = notification.fromUser?.username || 'Someone';
    
    switch (notification.type) {
      case 'like':
        return (
          <span>
            <strong>{fromUser}</strong> liked your blog{' '}
            <strong>"{notification.blog?.title || 'Untitled'}"</strong>
          </span>
        );
      case 'comment':
        return (
          <span>
            <strong>{fromUser}</strong> commented on your blog{' '}
            <strong>"{notification.blog?.title || 'Untitled'}"</strong>
          </span>
        );
      case 'follow':
        return (
          <span>
            <strong>{fromUser}</strong> started following you
          </span>
        );
      default:
        return 'New notification';
    }
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return notificationDate.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'like' || notification.type === 'comment') {
      navigate(`/blog/${notification.blog?._id}`);
    } else if (notification.type === 'follow') {
      navigate(`/profile/${notification.fromUser?._id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="text-center text-gray-600">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={() => {
              toast.promise(cleanupNotifications(), {
                pending: 'Cleaning up notifications...',
                success: 'Notifications cleaned up!',
                error: 'Failed to clean up notifications'
              });
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 ease-in-out"
          >
            Clear Old Notifications
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-100"
            >
              <div className="text-xl">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">
                  {getNotificationMessage(notification)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {getTimeAgo(notification.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
