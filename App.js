import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CropManagement from './components/CropManagement';
import CropCalendar from './components/CropCalendar';
import FertilizerCalculator from './components/FertilizerCalculator';
import WeatherWidget from './components/WeatherWidget';
import MarketPrices from './components/MarketPrices';
import Notification from './components/Notification';
import Help from './components/Help';
import './assets/styles.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <Notification />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crops" element={<CropManagement />} />
              <Route path="/calendar" element={<CropCalendar />} />
              <Route path="/calculator" element={<FertilizerCalculator />} />
              <Route path="/weather" element={<WeatherWidget />} />
              <Route path="/market" element={<MarketPrices />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;