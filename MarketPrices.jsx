import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import axios from 'axios';

const MarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('india');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Sample API key (replace with actual API key)
  const API_KEY = 'YOUR_MARKET_API_KEY';

  const fetchMarketPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, replace this with actual API call
      // const response = await axios.get(`https://api.marketdata.com/v1/prices?location=${location}&api_key=${API_KEY}`);
      
      // Mock response since we don't have a real API
      const mockResponse = {
        data: [
          {
            commodity: 'Wheat',
            variety: 'Sharbati',
            market: 'Delhi',
            minPrice: 2200,
            maxPrice: 2400,
            modalPrice: 2300,
            unit: 'Quintal',
            date: new Date().toISOString()
          },
          {
            commodity: 'Rice',
            variety: 'Basmati',
            market: 'Punjab',
            minPrice: 3500,
            maxPrice: 4000,
            modalPrice: 3800,
            unit: 'Quintal',
            date: new Date().toISOString()
          },
          {
            commodity: 'Maize',
            variety: 'Hybrid',
            market: 'Karnataka',
            minPrice: 1800,
            maxPrice: 2100,
            modalPrice: 1950,
            unit: 'Quintal',
            date: new Date().toISOString()
          },
          {
            commodity: 'Cotton',
            variety: 'Medium Staple',
            market: 'Gujarat',
            minPrice: 5500,
            maxPrice: 6000,
            modalPrice: 5800,
            unit: 'Quintal',
            date: new Date().toISOString()
          },
          {
            commodity: 'Soybean',
            variety: 'JS-335',
            market: 'Madhya Pradesh',
            minPrice: 3800,
            maxPrice: 4200,
            modalPrice: 4000,
            unit: 'Quintal',
            date: new Date().toISOString()
          }
        ]
      };
      
      setPrices(mockResponse.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch market prices. Please try again later.');
      console.error('Error fetching market prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices();
  }, [location]);

  const handleRefresh = () => {
    fetchMarketPrices();
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">Market Prices</h1>
        <div className="flex items-center space-x-4">
          <select
            value={location}
            onChange={handleLocationChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="india">India</option>
            <option value="punjab">Punjab</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="uttar-pradesh">Uttar Pradesh</option>
            <option value="karnataka">Karnataka</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Commodity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Variety</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Market</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Min Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Max Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Modal Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {prices.map((price, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{price.commodity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{price.variety}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{price.market}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{price.minPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{price.maxPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">₹{price.modalPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">/{price.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Note:</h3>
        <p className="text-blue-700 dark:text-blue-300">
          This is a simulated market data display. In a production environment, you would connect to a real agricultural market API like:
        </p>
        <ul className="list-disc pl-5 mt-2 text-blue-700 dark:text-blue-300">
          <li>Government agricultural market APIs (e.g., Indian APMC market data)</li>
          <li>Private agricultural market data providers</li>
          <li>Commodity exchange APIs</li>
        </ul>
        <a 
          href="https://agmarknet.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center mt-3 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Example: Agmarknet Government Portal <FiExternalLink className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default MarketPrices;