import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FiSun, FiMoon, FiHome, FiCalendar, FiDroplet, FiCloud, FiDollarSign, FiHelpCircle, FiCalculator } from 'react-icons/fi';

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(AppContext);

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <FiHome /> },
    { path: '/crops', name: 'Crop Management', icon: <FiDroplet /> },
    { path: '/calendar', name: 'Crop Calendar', icon: <FiCalendar /> },
    { path: '/calculator', name: 'Fertilizer Calc', icon: <FiCalculator /> },
    { path: '/weather', name: 'Weather', icon: <FiCloud /> },
    { path: '/market', name: 'Market Prices', icon: <FiDollarSign /> },
    { path: '/help', name: 'Help', icon: <FiHelpCircle /> }
  ];

  return (
    <nav className={`bg-green-600 dark:bg-gray-800 shadow-lg ${darkMode ? 'text-white' : 'text-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <span className="text-xl font-bold">🌱 AgriManage</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive 
                    ? 'bg-green-700 dark:bg-gray-900' 
                    : 'hover:bg-green-700 dark:hover:bg-gray-700'}`
                }
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-700 focus:outline-none">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-green-700 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-green-700 dark:bg-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md text-base font-medium ${isActive 
                  ? 'bg-green-800 dark:bg-gray-900' 
                  : 'hover:bg-green-800 dark:hover:bg-gray-600'}`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;