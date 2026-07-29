import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNotification } from '../context/NotificationContext';
import { HiBell, HiHeart, HiChatBubbleLeft, HiUserPlus } from 'react-icons/hi2';
import Avatar from 'react-avatar';
import profile1 from '../assets/profile.png';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const { notifications: socketNotifications, clearNotifications } = useNotification();

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${USER_API_END_POINT}/notifications/${user._id}`, {
        withCredentials: true
      });
      const notificationsData = Array.isArray(response.data.notifications) ? response.data.notifications : [];
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const allNotifications = React.useMemo(() => {
    const combined = [...socketNotifications, ...notifications];
    const uniqueNotifications = Array.from(
      new Map(combined.map(n => [n._id, n])).values()
    );
    return uniqueNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [socketNotifications, notifications]);

  const cleanupNotifications = async () => {
    try {
      await axios.delete(`${USER_API_END_POINT}/notifications/${user._id}`, {
        withCredentials: true
      });
      setNotifications([]);
      if (clearNotifications) {
        clearNotifications();
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return Promise.reject(error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <HiHeart className="text-rose-500" size={16} />;
      case 'comment':
        return <HiChatBubbleLeft className="text-indigo-600" size={15} />;
      case 'follow':
        return <HiUserPlus className="text-slate-800" size={15} />;
      default:
        return <HiBell className="text-slate-600" size={16} />;
    }
  };

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return '';
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'follow' && notification.fromUser?._id) {
      navigate(`/premium/profile/${notification.fromUser._id}`);
    } else {
      navigate('/premium');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm animate-pulse font-sans">
        <p className="text-xs font-bold text-slate-400">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <HiBell size={20} className="text-slate-900" />
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Notifications</h2>
        </div>
        {allNotifications.length > 0 && (
          <button
            onClick={() => {
              toast.promise(cleanupNotifications(), {
                pending: 'Cleaning up...',
                success: 'Notifications cleared',
                error: 'Failed to clear'
              });
            }}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {allNotifications.length === 0 ? (
        <div className="text-center py-12 text-slate-400 space-y-2">
          <HiBell size={32} className="mx-auto text-slate-300" />
          <p className="text-xs font-bold text-slate-700">You're all caught up!</p>
          <p className="text-[11px] text-slate-400">New activity on your posts or followers will show up here.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {allNotifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <Avatar
                  src={notification.fromUser?.profilePic || profile1}
                  size="38"
                  round
                  className="border border-slate-200"
                />
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white border border-slate-200 shadow-sm">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-800 leading-snug">
                  <strong className="text-slate-900 font-bold mr-1">{notification.fromUser?.name || 'Someone'}</strong>
                  {notification.type === 'like' && 'liked your post.'}
                  {notification.type === 'comment' && 'commented on your post.'}
                  {notification.type === 'follow' && 'started following you.'}
                  {notification.type === 'unfollow' && 'unfollowed you.'}
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  {getTimeAgo(notification.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;