import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Notification = () => {
  const { notifications, setNotifications } = useContext(AppContext);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="h-5 w-5" />;
      case 'error':
        return <FiAlertCircle className="h-5 w-5" />;
      default:
        return <FiInfo className="h-5 w-5" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700 dark:bg-green-800 dark:border-green-600 dark:text-green-200';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700 dark:bg-red-800 dark:border-red-600 dark:text-red-200';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-800 dark:border-blue-600 dark:text-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border-l-4 rounded p-4 max-w-xs w-full shadow-lg flex items-start ${getColor(notification.type)}`}
        >
          <div className="flex-shrink-0 mr-3">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
            className="ml-2 flex-shrink-0"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;