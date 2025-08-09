import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Notification from './Notification';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed top-4 right-0 left-0 z-50 flex flex-col items-center pointer-events-none">
      <div className="w-full max-w-sm px-4 sm:px-0">
        <AnimatePresence>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationContainer;
