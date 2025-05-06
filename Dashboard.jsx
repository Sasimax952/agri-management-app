import React, { useContext, useMemo } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { AppContext } from '../context/AppContext';
import { FiDownload, FiUpload, FiCalendar, FiDroplet, FiSun } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const { crops, darkMode } = useContext(AppContext);

  // Calculate statistics
  const { seasonDistribution, fertilizerUsage, totalYield, totalArea, avgYieldPerAcre, yieldTrend } = useMemo(() => {
    // Crop distribution by season
    const seasonDist = crops.reduce((acc, crop) => {
      acc[crop.season] = (acc[crop.season] || 0) + 1;
      return acc;
    }, {});

    // Fertilizer usage
    const fertUsage = crops.reduce((acc, crop) => {
      acc[crop.fertilizer] = (acc[crop.fertilizer] || 0) + 1;
      return acc;
    }, {});

    // Total yield and area
    const yieldTotal = crops.reduce((sum, crop) => sum + parseFloat(crop.yield || 0), 0);
    const areaTotal = crops.reduce((sum, crop) => sum + parseFloat(crop.area || 0), 0);
    const avgYield = areaTotal > 0 ? (yieldTotal / areaTotal).toFixed(2) : 0;

    // Yield trend (last 5 crops)
    const lastFiveCrops = [...crops].reverse().slice(0, 5);
    const trend = {
      labels: lastFiveCrops.map(crop => crop.name),
      data: lastFiveCrops.map(crop => parseFloat(crop.yield))
    };

    return {
      seasonDistribution: seasonDist,
      fertilizerUsage: fertUsage,
      totalYield: yieldTotal.toFixed(2),
      totalArea: areaTotal.toFixed(2),
      avgYieldPerAcre: avgYield,
      yieldTrend: trend
    };
  }, [crops]);

  // Chart options with dark mode support
  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#fff' : '#333'
        }
      },
      title: {
        display: true,
        text: title,
        color: darkMode ? '#fff' : '#333'
      },
    },
    scales: {
      y: {
        ticks: {
          color: darkMode ? '#fff' : '#333'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: darkMode ? '#fff' : '#333'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  });

  // Season distribution chart data
  const seasonChartData = {
    labels: Object.keys(seasonDistribution),
    datasets: [
      {
        label: 'Number of Crops',
        data: Object.values(seasonDistribution),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Fertilizer usage chart data
  const fertilizerChartData = {
    labels: Object.keys(fertilizerUsage),
    datasets: [
      {
        label: 'Fertilizer Usage',
        data: Object.values(fertilizerUsage),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Yield trend chart data
  const yieldTrendData = {
    labels: yieldTrend.labels,
    datasets: [
      {
        label: 'Yield (tons)',
        data: yieldTrend.data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  // Handle data export
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Crop Name,Season,Fertilizer,Yield (tons),Area (acres)\n" +
      crops.map(crop => 
        `${crop.name},${crop.season},${crop.fertilizer},${crop.yield},${crop.area}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "crop_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle data import (simplified for example)
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // In a real app, you would parse the CSV and validate the data
      alert('CSV import functionality would be implemented here');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Farm Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
            <FiCalendar className="text-green-600 dark:text-green-300 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Crops</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{crops.length}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
            <FiDroplet className="text-blue-600 dark:text-blue-300 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Area</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalArea} acres</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
            <FiSun className="text-yellow-600 dark:text-yellow-300 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Yield</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalYield} tons</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
            <FiSun className="text-purple-600 dark:text-purple-300 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Yield/Acre</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{avgYieldPerAcre} tons</p>
          </div>
        </div>
      </div>
      
      {/* Data Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
          >
            <FiDownload className="mr-2" /> Export to CSV
          </button>
          
          <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center cursor-pointer">
            <FiUpload className="mr-2" /> Import from CSV
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleImport} 
              className="hidden" 
            />
          </label>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Season Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Crop Distribution by Season</h3>
          <div className="h-64">
            <Pie 
              data={seasonChartData} 
              options={chartOptions('Crop Distribution by Season')} 
            />
          </div>
        </div>
        
        {/* Fertilizer Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Fertilizer Usage</h3>
          <div className="h-64">
            <Bar 
              data={fertilizerChartData} 
              options={chartOptions('Fertilizer Usage')} 
            />
          </div>
        </div>
        
        {/* Yield Trend */}
        {crops.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Yield Trend</h3>
            <div className="h-64">
              <Line 
                data={yieldTrendData} 
                options={chartOptions('Recent Yield Trend (tons)')} 
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Crops */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Crops</h3>
          {crops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Crop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Season
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fertilizer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Yield (tons)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Area (acres)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {[...crops].reverse().slice(0, 5).map((crop) => (
                    <tr key={crop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {crop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {crop.fertilizer.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {crop.yield}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {crop.area}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No crops added yet. Add some crops to see data here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;