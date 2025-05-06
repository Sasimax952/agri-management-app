import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { exportToCSV } from '../utils/dataExport';

// Add this import for the modal component
import CropFormModal from './CropFormModal';

const CropManagement = () => {
  const { crops, setCrops, addNotification } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeason, setFilterSeason] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCrop, setCurrentCrop] = useState(null);

  // Available seasons and fertilizers
  const seasons = ['Kharif', 'Rabi', 'Zaid', 'Perennial'];
  const fertilizers = ['Urea', 'DAP', 'MOP', 'Organic', 'NPK'];

  // Filter crops based on search and season filter
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = filterSeason === 'all' || crop.season === filterSeason;
    return matchesSearch && matchesSeason;
  });

  // Handle crop deletion
  const handleDelete = (id) => {
    setCrops(crops.filter(crop => crop.id !== id));
    addNotification('Crop deleted successfully', 'success');
  };

  // Open modal for editing
  const handleEdit = (crop) => {
    setCurrentCrop(crop);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (formData) => {
    if (currentCrop) {
      // Update existing crop
      setCrops(crops.map(crop => 
        crop.id === currentCrop.id ? { ...formData, id: currentCrop.id } : crop
      ));
      addNotification('Crop updated successfully', 'success');
    } else {
      // Add new crop
      const newCrop = { ...formData, id: Date.now() };
      setCrops([...crops, newCrop]);
      addNotification('Crop added successfully', 'success');
    }
    setIsModalOpen(false);
    setCurrentCrop(null);
  };

  // Export to CSV
  const handleExport = () => {
    exportToCSV(crops, 'crop_data.csv');
    addNotification('Data exported successfully', 'success');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ... rest of your JSX remains the same ... */}
      
      {/* Make sure the CropFormModal is properly included */}
      <CropFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentCrop(null);
        }}
        onSubmit={handleSubmit}
        currentCrop={currentCrop}
        seasons={seasons}
        fertilizers={fertilizers}
      />
    </div>
  );
};

export default CropManagement;