// src/components/NotificationBadge.jsx
import { useSelector } from 'react-redux';

const NotificationBadge = () => {
  const { unreadCount } = useSelector((state) => state.notifications);
  
  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {unreadCount}
    </span>
  );
};

export default NotificationBadge;