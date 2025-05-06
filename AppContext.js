import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [crops, setCrops] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Load initial data from localStorage
  useEffect(() => {
    const savedCrops = localStorage.getItem('crops');
    if (savedCrops) setCrops(JSON.parse(savedCrops));
    
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setDarkMode(JSON.parse(savedMode));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(notifications.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <AppContext.Provider value={{
      crops,
      setCrops,
      darkMode,
      setDarkMode,
      notifications,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};