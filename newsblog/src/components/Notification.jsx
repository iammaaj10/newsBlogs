import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
      // Fetch notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${USER_API_END_POINT}/notifications/${user._id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const cleanupNotifications = async () => {
    try {
      await axios.delete(`${USER_API_END_POINT}/cleanup-notifications`);
      toast.success('Notifications cleaned up', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      toast.error('Failed to cleanup notifications', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.fromUser?.username || 'Someone'} liked your blog "${notification.blog?.title || 'a blog'}"`;
      case 'comment':
        return `${notification.fromUser?.username || 'Someone'} commented on your blog "${notification.blog?.title || 'a blog'}"`;
      case 'follow':
        return `${notification.fromUser?.username || 'Someone'} started following you`;
      default:
        return 'New notification';
    }
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    return notificationDate.toLocaleString();
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
        <div className="text-center">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={cleanupNotifications}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear Old Notifications
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 p-4 bg-white rounded-lg shadow">
          No new notifications
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <p className="text-gray-800 font-medium">
                {getNotificationMessage(notification)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {getTimeAgo(notification.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;

