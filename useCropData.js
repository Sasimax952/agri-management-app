import { useState, useEffect } from 'react';

const useCropData = () => {
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchCropData = async () => {
      try {
        // In a real app, this would be an actual API call
        const data = JSON.parse(localStorage.getItem('crops')) || [];
        setCropData(data);
      } catch (err) {
        setError('Failed to load crop data');
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, []);

  const updateCropData = (newData) => {
    setCropData(newData);
    localStorage.setItem('crops', JSON.stringify(newData));
  };

  return { cropData, loading, error, updateCropData };
};

export default useCropData;