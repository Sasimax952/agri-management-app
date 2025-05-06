import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const WeatherWidget = () => {
  const { addNotification } = useContext(AppContext);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key

  const getWeather = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
      addNotification('Weather data fetched successfully', 'success');
    } catch (error) {
      console.error('Error fetching weather:', error);
      addNotification('Failed to fetch weather data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setCoords({ lat, lon });
        await getWeather(lat, lon);
      } else {
        addNotification('Location not found', 'error');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      addNotification('Failed to search location', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          await getWeather(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          addNotification('Failed to get current location', 'error');
          setLoading(false);
        }
      );
    } else {
      addNotification('Geolocation is not supported by your browser', 'error');
    }
  };

  // Get weather for current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Weather Information</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleLocationSearch} className="flex space-x-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Locating...' : 'Current Location'}
          </button>
        </form>
      </div>
      
      {weather && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {weather.name}, {weather.sys?.country}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(weather.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-16 h-16"
                  />
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">
                    {Math.round(weather.main.temp)}°C
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Feels Like</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {weather.main.humidity}%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {Math.round(weather.wind.speed * 3.6)} km/h
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Weather Advisory
            </h4>
            <p className="text-gray-800 dark:text-white">
              {weather.weather[0].main === 'Rain' && (
                'Rain expected. Consider delaying field work and irrigation.'
              )}
              {weather.weather[0].main === 'Clear' && (
                'Clear skies. Good conditions for field work and harvesting.'
              )}
              {weather.weather[0].main === 'Clouds' && (
                'Cloudy conditions. Monitor crops for adequate sunlight.'
              )}
              {weather.weather[0].main === 'Extreme' && (
                'Extreme weather warning! Take necessary precautions to protect crops and livestock.'
              )}
              {!['Rain', 'Clear', 'Clouds', 'Extreme'].includes(weather.weather[0].main) && (
                'Normal weather conditions. Proceed with regular farming activities.'
              )}
            </p>
          </div>
        </div>
      )}
      
      {!weather && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            No weather data available. Search for a location or allow access to your current location.
          </p>
        </div>
      )}
      
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading weather data...</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;