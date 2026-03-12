import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Fuel, Gauge, UserCheck, CarFront, CircleDollarSign, IdCard, ChevronLeft, ChevronRight } from "lucide-react";
import styles from '../../styles/DetailPages.module.css';
import Navbar from "../Navbar";
import ReviewSection from "../ReviewSection";
import { getLocations } from '../../../services/api';
import { LocationCard } from '../locations/LocationCard';
import LocationDetail from '../locations/LocationDetail';

export const VehicleDetail = ({ vehicle, onBack }) => {
  const reviews = vehicle.reviews || vehicle.reviews?.data || [];
  const averageRating = vehicle.reviews_avg_rating ? parseFloat(vehicle.reviews_avg_rating) : 0;
  const reviewCount = vehicle.reviews_count || reviews.length;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleLocations = async () => {
      if (vehicle?.locations && vehicle.locations.length > 0) {
        try {
          setLoading(true);
          // Use existing index endpoint and filter client-side
          const response = await getLocations();
          const allLocations = response.data;
          // Filter locations based on vehicle's locations array
          const vehicleLocations = allLocations.filter(location => 
            vehicle.locations.includes(location.locationName)
          );
          setLocations(vehicleLocations);
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchVehicleLocations();
  }, [vehicle]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  const renderStars = (rating) => {
    const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.round(numericRating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/vehicles');
    }
  };

  const nextImage = () => {
    if (vehicle?.vehicleImage?.length) {
      setCurrentImageIndex((prev) => 
        prev === vehicle.vehicleImage.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle?.vehicleImage?.length) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? vehicle.vehicleImage.length - 1 : prev - 1
      );
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleLocationBack = () => {
    setSelectedLocation(null);
  };

  if (selectedLocation) {
    return <LocationDetail location={selectedLocation} onBack={handleLocationBack} />;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 pt-16 ${styles.entityDetails}`}>
      <Navbar onScrollToSection={scrollToSection} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-128 overflow-hidden">
            <div className="relative w-full h-full">
              {vehicle.vehicleImage && vehicle.vehicleImage.length > 0 ? (
                <img
                  src={`http://localhost:8000/storage/${vehicle.vehicleImage[currentImageIndex]}`}
                  alt={vehicle.vehicleName}
                  className={`w-full h-full object-cover transition-all duration-500 ${styles.heroImage}`}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <button
                onClick={handleBack}
                className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>

              {/* Vehicle Type Badge */}
              {vehicle?.vehicleType && (
                <div className="absolute top-5 right-5 bg-neutral-100 text-black rounded-lg px-2 py-1">
                  <div className="flex items-center gap-1">
                    <CarFront className="size-6" />
                    <span className="text-xl font-medium">{vehicle.vehicleType}</span>
                  </div>
                </div>
              )}
              {/* Price Badge */}
              {vehicle?.pricePerDay && (
                <div className="absolute bottom-5 right-5 bg-neutral-50 text-black rounded-lg px-2 py-1">
                  <div className="flex items-center gap-1">
                    <CircleDollarSign className="size-6" />
                    <span className="text-xl font-medium">LKR. {vehicle.pricePerDay}/day</span>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
              {/* Image Navigation */}
              {vehicle.vehicleImage && vehicle.vehicleImage.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/30 transition-all ${styles.imageNavButton}`}
                  >
                    <ChevronLeft size={24} className="text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/30 transition-all ${styles.imageNavButton}`}
                  >
                    <ChevronRight size={24} className="text-white" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {vehicle.vehicleImage && vehicle.vehicleImage.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {vehicle.vehicleImage.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Title Overlay */}
            <div className={`absolute bottom-8 left-8 text-white ${styles.animateSlideInUp}`}>
              <h1 className="text-4xl font-bold mb-2">{vehicle.vehicleName}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-5">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className={`bg-white rounded-2xl shadow-lg p-8 ${styles.animateSlideInLeft}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Vehicle</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {vehicle.description}
                  </p>
                  {/* Locations - Added this section similar to languages in GuideDetail */}
                  {vehicle.locations && vehicle.locations.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">Available Locations</h2>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.locations.map((location, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Quick Info */}
                <div className={`bg-white rounded-2xl shadow-lg p-6 ${styles.animateSlideInRight} ${styles.animateStagger1}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    {vehicle.vehicleNumber && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <IdCard className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span><strong>Registration No:</strong> {vehicle.vehicleNumber}</span>
                      </div>
                    )}
                    {vehicle.withDriver && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span><strong>Driver Status:</strong> {vehicle.withDriver}</span>
                      </div>
                    )}
                    {vehicle.fuelType && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Fuel className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span><strong>Fuel Type:</strong> {vehicle.fuelType}</span>
                      </div>
                    )}
                    {vehicle.mileagePerDay && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Gauge className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span><strong>Mileage Per Day:</strong> {vehicle.mileagePerDay}</span>
                      </div>
                    )}
                    {reviews.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600"><strong>Rating</strong></span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">({averageRating ? averageRating.toFixed(1) : '0.0'})</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Locations Section */}
            <div className="mb-5">
              <div className="pt-5 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Available Locations</h2>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : locations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Sort locations by rating (highest first) */}
                    {locations
                      .sort((a, b) => {
                        const ratingA = a.reviews_avg_rating || 0;
                        const ratingB = b.reviews_avg_rating || 0;
                        return ratingB - ratingA;
                      })
                      .map(location => (
                        <LocationCard
                          key={location.id}
                          location={location}
                          rating={location.reviews_avg_rating || 0}
                          reviewCount={location.reviews_count || 0}
                          // Make location cards read-only (non-clickable)
                          isClickable={false}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No locations available for this vehicle.</p>
                    {vehicle.locations && vehicle.locations.length > 0 && (
                      <p className="text-sm text-gray-400 mt-2">
                        This vehicle is available on: {vehicle.locations.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 pt-5 border-t">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              
              {/* Reviews Summary */}
              {reviewCount > 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600">
                        {averageRating ? averageRating.toFixed(1) : '0.0'}
                      </div>
                      <div className="flex justify-center mt-1">
                        {renderStars(Math.round(averageRating))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(review => review.rating === star).length;
                        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                        
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-4">{star}</span>
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
                  <p className="text-gray-500">No reviews yet. Be the first to review this vehicle!</p>
                </div>
              )}

              {/* ReviewSection Component */}
              <ReviewSection entityType="vehicle" entityId={vehicle?.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehicleDetail;