import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Star, GlobeIcon, MountainIcon} from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import LocationMap from './LocationMap';
import styles from '../../styles/DetailPages.module.css';
import Navbar from '../Navbar';
import ReviewSection from '../ReviewSection';
import { getRelatedData } from '../../../services/api';
import { GuideCard } from '../guides/GuideCard';
import GuideDetail from '../guides/GuideDetail';
import { ShopCard } from '../shops/ShopCard';
import ShopDetail from '../shops/ShopDetail';
import { HotelCard } from '../hotels/HotelCard';
import HotelDetail from '../hotels/HotelDetail';
import { VehicleCard } from '../vehicles/VehicleCard';
import VehicleDetail from '../vehicles/VehicleDetail';

const LocationDetail = ({ location, onBack }) => {
  const reviews = location.reviews || location.reviews?.data || [];
  const averageRating = location.reviews_avg_rating ? parseFloat(location.reviews_avg_rating) : 0;
  const reviewCount = location.reviews_count || reviews.length;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guides, setGuides] = useState([]);
  const [shops, setShops] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate();

  // Normalize image data
  const getImages = () => {
    if (location.images && location.images.length > 0) {
      // Images array with image_path
      return location.images.map(img => img.image_path);
    } else {
      return [];
    }
  };

  const images = getImages();

  // Fetch all related data in a single API call
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (location?.id) {
        try {
          setLoading(true);
          const response = await getRelatedData(location.id);
          if (response.data.success) {
            setGuides(response.data.data.guides || []);
            setShops(response.data.data.shops || []);
            setHotels(response.data.data.hotels || []);
            setVehicles(response.data.data.vehicles || []);
          }
        } catch (error) {
          console.error('Error fetching related data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRelatedData();
  }, [location]);

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
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/locations');
    }
  };

  const nextImage = () => {
    if (location?.locationImage?.length) {
      setCurrentImageIndex((prev) => 
        prev === location.locationImage.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (location?.locationImage?.length) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? location.locationImage.length - 1 : prev - 1
      );
    }
  };

  const handleGuideClick = (guide) => {
    setSelectedGuide(guide);
  };

  const handleGuideBack = () => {
    setSelectedGuide(null);
  };

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
  };

  const handleShopBack = () => {
    setSelectedShop(null);
  };

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleHotelBack = () => {
    setSelectedHotel(null);
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleVehicleBack = () => {
    setSelectedVehicle(null);
  };

  if (selectedGuide) {
    return <GuideDetail guide={selectedGuide} onBack={handleGuideBack} />;
  }

  if (selectedShop) {
    return <ShopDetail shop={selectedShop} onBack={handleShopBack} />;
  }

  if (selectedHotel) {
    return <HotelDetail hotel={selectedHotel} onBack={handleHotelBack} />;
  }

  if (selectedVehicle) {
    return <VehicleDetail vehicle={selectedVehicle} onBack={handleVehicleBack} />;
  }

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location details...</p>
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
              {images.length > 0 ? (
                <img
                  src={`http://localhost:8000/storage/${images[currentImageIndex]}`}
                  alt={location.locationName}
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Image Navigation */}
              {images.length > 1 && (
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
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
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

            {/* Location Title Overlay */}
            <div className={`absolute bottom-8 left-8 text-white ${styles.animateSlideInUp}`}>
              <h1 className="text-4xl font-bold mb-2">{location.locationName}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className={`bg-white rounded-2xl shadow-lg p-8 ${styles.animateSlideInLeft}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Location</h2>
                  <p className="text-gray-600 leading-relaxed mb-6 break-words">
                    {location.shortDescription}
                  </p>
                  <div className="prose prose-lg text-gray-700">
                    <p className="break-words">{location.longDescription}</p>
                  </div>
                </div>

                {/* Map Section */}
                <div className={`bg-white rounded-2xl shadow-lg p-8 ${styles.animateSlideInLeft} ${styles.animateStagger1}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Map</h2>
                  <LocationMap
                    latitude={location.latitude}
                    longitude={location.longitude}
                    name={location.locationName}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Quick Info */}
                <div className={`bg-white rounded-2xl shadow-lg p-6 ${styles.animateSlideInRight} ${styles.animateStagger1}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    {location.locationType && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MountainIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{location.locationType}</span>
                      </div>
                    )}
                    {location.province && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <GlobeIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{location.province} Province</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Latitude</span>
                      <span className="font-medium">{location.latitude}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Longitude</span>
                      <span className="font-medium">{location.longitude}</span>
                    </div>
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

                {/* Weather Widget */}
                <div className={`${styles.animateSlideInRight}`}>
                  <WeatherWidget location={{ latitude: location.latitude, longitude: location.longitude }} />
                </div>
              </div>
            </div>

            {/* Guides Section */}
            <div className="mb-8">
              <div className="pt-5 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Guides</h2>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : guides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sort guides by rating (highest first) */}
                    {guides
                      .sort((a, b) => {
                        const ratingA = a.reviews_avg_rating || 0;
                        const ratingB = b.reviews_avg_rating || 0;
                        return ratingB - ratingA;
                      })
                      .map(guide => (
                        <GuideCard
                          key={guide.id}
                          guide={guide}
                          rating={guide.reviews_avg_rating || 0}
                          reviewCount={guide.reviews_count || 0}
                          onClick={handleGuideClick}
                          isClickable={false}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No guides available for this location.</p>
                )}
              </div>
            </div>

            {/* Shops Section */}
            <div className="mb-8">
              <div className="pt-5 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Shops</h2>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : shops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sort shops by rating (highest first) */}
                    {shops
                      .sort((a, b) => {
                        const ratingA = a.reviews_avg_rating || 0;
                        const ratingB = b.reviews_avg_rating || 0;
                        return ratingB - ratingA;
                      })
                      .map(shop => (
                        <ShopCard
                          key={shop.id}
                          shop={shop}
                          rating={shop.reviews_avg_rating || 0}
                          reviewCount={shop.reviews_count || 0}
                          onClick={handleShopClick}
                          isClickable={false}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No shops nearby for this location.</p>
                )}
              </div>
            </div>

            {/* Hotels Section */}
            <div className="mb-8">
              <div className="pt-5 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Hotels</h2>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : hotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sort hotels by rating (highest first) */}
                    {hotels
                      .sort((a, b) => {
                        const ratingA = a.reviews_avg_rating || 0;
                        const ratingB = b.reviews_avg_rating || 0;
                        return ratingB - ratingA;
                      })
                      .map(hotel => (
                        <HotelCard
                          key={hotel.id}
                          hotel={hotel}
                          rating={hotel.reviews_avg_rating || 0}
                          reviewCount={hotel.reviews_count || 0}
                          onClick={handleHotelClick}
                          isClickable={false}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hotels nearby for this location.</p>
                )}
              </div>
            </div>

            {/* Vehicles Section */}
            <div className="mb-8">
              <div className="pt-5 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Vehicles</h2>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : vehicles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sort vehicles by rating (highest first) */}
                    {vehicles
                      .sort((a, b) => {
                        const ratingA = a.reviews_avg_rating || 0;
                        const ratingB = b.reviews_avg_rating || 0;
                        return ratingB - ratingA;
                      })
                      .map(vehicle => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          rating={vehicle.reviews_avg_rating || 0}
                          reviewCount={vehicle.reviews_count || 0}
                          onClick={handleVehicleClick}
                          isClickable={false}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No vehicles available for this location.</p>
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
                  <p className="text-gray-500">No reviews yet. Be the first to review this location!</p>
                </div>
              )}

              {/* ReviewSection Component */}
              <ReviewSection entityType="location" entityId={location?.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationDetail;