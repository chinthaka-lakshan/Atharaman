import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HotelDetail from '../components/hotels/HotelDetail';

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/hotels/${id}`);
        setHotel(response.data);
      } catch (error) {
        console.error('Error fetching hotel:', error);
        // Redirect to hotels page if not found
        navigate('/hotels', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/hotels');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return null;
  }

  return <HotelDetail hotel={hotel} onBack={handleBack} />;
};

export default HotelDetailPage;