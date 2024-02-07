import React from 'react';
import { useNotification } from './NotificationContext';
import '../assets/NotificationSystem.css';

const NotificationDisplay = () => {
  const { notifications } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className="notification">
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;