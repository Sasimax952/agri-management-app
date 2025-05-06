import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const fertilizerRates = {
  wheat: { urea: 100, DAP: 50, MOP: 25 },
  rice: { urea: 120, DAP: 60, MOP: 30 },
  maize: { urea: 80, DAP: 40, MOP: 20 },
  cotton: { urea: 90, DAP: 45, MOP: 22 },
  sugarcane: { urea: 150, DAP: 75, MOP: 37 }
};

const FertilizerCalculator = () => {
  const { crops, addNotification } = useContext(AppContext);
  const [calculation, setCalculation] = useState({
    cropType: '',
    fertilizerType: 'urea',
    area: '',
    result: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCalculation({ ...calculation, [name]: value, result: null });
  };

  const calculateFertilizer = (e) => {
    e.preventDefault();
    
    if (!calculation.cropType || !calculation.area) {
      addNotification('Please select crop type and enter area', 'error');
      return;
    }
    
    if (isNaN(calculation.area) || calculation.area <= 0) {
      addNotification('Please enter a valid area', 'error');
      return;
    }
    
    const crop = calculation.cropType.toLowerCase();
    const fertilizer = calculation.fertilizerType;
    
    if (!fertilizerRates[crop] || !fertilizerRates[crop][fertilizer]) {
      addNotification('Fertilizer data not available for this crop', 'error');
      return;
    }
    
    const rate = fertilizerRates[crop][fertilizer];
    const total = rate * calculation.area;
    
    setCalculation({
      ...calculation,
      result: {
        crop: calculation.cropType,
        fertilizer,
        rate,
        area: calculation.area,
        total: total.toFixed(2)
      }
    });
    
    addNotification('Calculation completed successfully', 'success');
  };

  // Get unique crop names from existing crops
  const cropOptions = [...new Set(crops.map(crop => crop.name))];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Fertilizer Calculator</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={calculateFertilizer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Crop Type *
              </label>
              <select
                name="cropType"
                value={calculation.cropType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Crop</option>
                {cropOptions.map((crop, index) => (
                  <option key={index} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fertilizer Type *
              </label>
              <select
                name="fertilizerType"
                value={calculation.fertilizerType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="urea">Urea</option>
                <option value="DAP">DAP (Di-ammonium Phosphate)</option>
                <option value="MOP">MOP (Muriate of Potash)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Area (acres) *
              </label>
              <input
                type="number"
                name="area"
                value={calculation.area}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Calculate
          </button>
        </form>
        
        {calculation.result && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              Fertilizer Calculation Result
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Crop:</p>
                <p className="font-medium text-gray-900 dark:text-white">{calculation.result.crop}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Fertilizer:</p>
                <p className="font-medium text-gray-900 dark:text-white">{calculation.result.fertilizer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Application Rate (kg/acre):</p>
                <p className="font-medium text-gray-900 dark:text-white">{calculation.result.rate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Area (acres):</p>
                <p className="font-medium text-gray-900 dark:text-white">{calculation.result.area}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Fertilizer Needed:</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {calculation.result.total} kg
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Standard Fertilizer Application Rates (kg/acre)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Crop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Urea
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  DAP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  MOP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(fertilizerRates).map(([crop, rates]) => (
                <tr key={crop}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {rates.urea}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {rates.DAP}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {rates.MOP}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FertilizerCalculator;