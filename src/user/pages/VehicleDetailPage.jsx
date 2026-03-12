import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VehicleDetail from '../components/vehicles/VehicleDetail';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/vehicles/${id}`);
        setVehicle(response.data);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        // Redirect to vehicles page if not found
        navigate('/vehicles', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/vehicles');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return <VehicleDetail vehicle={vehicle} onBack={handleBack} />;
};

export default VehicleDetailPage;