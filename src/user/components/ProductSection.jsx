import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Globe, CircleDollarSign, UserCheck, Star, Phone, MapPinned, Fuel, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductSection = ({ id, title, data, type, onSeeMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailType, setDetailType] = useState(null);
  const navigate = useNavigate();

  // Sort and limit
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let sortedData = [...data];
    
    // Sort by average rating (highest first)
    if (type === 'location' || type === 'guide' || type === 'shop' || type === 'hotel' || type === 'vehicle') {
      sortedData.sort((a, b) => {
        const ratingA = parseFloat(a.reviews_avg_rating || a.averageRating || 0);
        const ratingB = parseFloat(b.reviews_avg_rating || b.averageRating || 0);
        return ratingB - ratingA;
      });
      
      // Take only top 6 items
      sortedData = sortedData.slice(0, 6);
    }
    
    return sortedData;
  }, [data, type]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || processedData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 3 >= processedData.length ? 0 : prevIndex + 3
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [processedData.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= processedData.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 3 < 0 ? Math.max(0, Math.floor((processedData.length - 1) / 3) * 3) : prevIndex - 3
    );
  };

  const handleCardClick = (item) => {
    if (type === 'location') {
      navigate(`/locations/${item.id}`);
    } else if (type === 'guide') {
      navigate(`/guides/${item.id}`);
    } else if (type === 'shop') {
      navigate(`/shops/${item.id}`);
    } else if (type === 'hotel') {
      navigate(`/hotels/${item.id}`);
    } else if (type === 'vehicle') {
      navigate(`/vehicles/${item.id}`);
    } else {
      setSelectedItem(item);
      setDetailType(type);
    }
  };

  const handleBack = () => {
    setSelectedItem(null);
    setDetailType(null);
  };

  const handleSeeMore = () => {
    switch(type) {
      case 'location':
        navigate('/locations');
        break;
      case 'guide':
        navigate('/guides');
        break;
      case 'shop':
        navigate('/shops');
        break;
      case 'hotel':
        navigate('/hotels');
        break;
      case 'vehicle':
        navigate('/vehicles');
        break;
      default:
        if (onSeeMore) {
          onSeeMore(type);
        } else {
          const sectionId = `${type}-section`;
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
    }
  };

  const renderStars = (rating) => {
    const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.round(numericRating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  // Function to determine category for locations
  const getCategory = (location) => {
    const type = location.locationType?.toLowerCase() || '';
    const name = location.locationName?.toLowerCase() || '';
    
    if (type.includes('mountain') || name.includes('mountain')) return 'Mountain';
    if (type.includes('rock') || name.includes('rock')) return 'Rock';
    if (type.includes('plain') || name.includes('plain')) return 'Plain';
    if (type.includes('valley') || name.includes('valley')) return 'Valley';
    if (type.includes('beach') || name.includes('beach')) return 'Beach';
    if (type.includes('cliff') || name.includes('cliff')) return 'Cliff';
    if (type.includes('desert') || name.includes('desert')) return 'Desert';
    if (type.includes('forest') || name.includes('forest')) return 'Forest';
    if (type.includes('temple') || name.includes('temple')) return 'Temple';
    if (type.includes('building') || name.includes('building')) return 'Building';
    if (type.includes('lake') || name.includes('lake')) return 'Lake';
    if (type.includes('river') || name.includes('river')) return 'River';
    if (type.includes('island') || name.includes('island')) return 'Island';
    if (type.includes('road') || name.includes('road')) return 'Road';
    if (type.includes('village') || name.includes('village')) return 'Village';
    
    return 'Other';
  };

  // Get image URL for locations
  const getLocationImage = (location) => {
    return location.images && location.images.length > 0 
      ? `http://localhost:8000/storage/${location.images[0].image_path}`
      : '/default-location.jpg';
  };

  // Get image URL for guides
  const getGuideImage = (guide) => {
    return guide.guideImage && guide.guideImage.length > 0 
      ? `http://localhost:8000/storage/${guide.guideImage[0]}`
      : '/default-guide.jpg';
  };

  // Get image URL for shops
  const getShopImage = (shop) => {
    return shop.shopImage && shop.shopImage.length > 0 
      ? `http://localhost:8000/storage/${shop.shopImage[0]}`
      : '/default-shop.jpg';
  };

  // Get image URL for hotels
  const getHotelImage = (hotel) => {
    return hotel.hotelImage && hotel.hotelImage.length > 0 
      ? `http://localhost:8000/storage/${hotel.hotelImage[0]}`
      : '/default-hotel.jpg';
  };

  // Get image URL for vehicles
  const getVehicleImage = (vehicle) => {
    return vehicle.vehicleImage && vehicle.vehicleImage.length > 0 
      ? `http://localhost:8000/storage/${vehicle.vehicleImage[0]}`
      : '/default-vehicle.jpg';
  };

  // Safely parse rating value to number
  const parseRating = (rating) => {
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') {
      const parsed = parseFloat(rating);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const renderCard = (item, index) => {
    const cardClass = "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in";
    
    switch (type) {
      case 'location':
        const locationAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const locationReviewCount = item.reviews_count || item.reviewCount || 0;
        const category = getCategory(item);
        
        return (
          <div key={item.id} className={cardClass} onClick={() => handleCardClick(item)} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative h-48 overflow-hidden">
              <img 
                src={getLocationImage(item)} 
                alt={item.locationName} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-location.jpg';
                }}
              />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                {category}
              </div>

              {/* Rating Badge */}
              {locationAvgRating > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full flex items-center">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span className="text-xs text-white font-semibold">{locationAvgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.locationName}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Globe className="size-4 mr-2" />
                <span>{item.province} Province</span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.shortDescription || item.description}
              </p>
              
              {locationReviewCount > 0 && (
                <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span>{locationReviewCount} review{locationReviewCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'guide':
        const guideAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const guideReviewCount = item.reviews_count || item.reviewCount || 0;
        
        return (
          <div key={item.id} className={cardClass} onClick={() => handleCardClick(item)} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative h-48 overflow-hidden">
              <img 
                src={getGuideImage(item)} 
                alt={item.guideName} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-guide.jpg';
                }}
              />
              
              {/* Rating Badge */}
              {guideAvgRating > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full flex items-center">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span className="text-xs text-white font-semibold">{guideAvgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.guideName}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Phone className="size-4 mr-2" />
                <span>{item.personalNumber}</span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.description}
              </p>
              
              {guideReviewCount > 0 && (
                <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span>{guideReviewCount} review{guideReviewCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'shop':
        const shopAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const shopReviewCount = item.reviews_count || item.reviewCount || 0;

        return (
          <div key={item.id} className={cardClass} onClick={() => handleCardClick(item)} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative h-48 overflow-hidden">
              <img 
                src={getShopImage(item)} 
                alt={item.shopName} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-shop.jpg';
                }}
              />

              {/* Rating Badge */}
              {shopAvgRating > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full flex items-center">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span className="text-xs text-white font-semibold">{shopAvgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.shopName}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPinned className="size-4 mr-2" />
                <span>{item.shopAddress}</span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.description}
              </p>

              {shopReviewCount > 0 && (
                <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span>{shopReviewCount} review{shopReviewCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'hotel':
        const hotelAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const hotelReviewCount = item.reviews_count || item.reviewCount || 0;

        return (
          <div key={item.id} className={cardClass} onClick={() => handleCardClick(item)} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative h-48 overflow-hidden group">
              <img 
                src={getHotelImage(item)} 
                alt={item.hotelName} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-hotel.jpg';
                }}
              />

              {/* Rating Badge */}
              {hotelAvgRating > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full flex items-center">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span className="text-xs text-white font-semibold">{hotelAvgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.hotelName}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPinned className="size-4 mr-2" />
                <span>{item.hotelAddress}</span>
              </div>

              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Phone className="size-4 mr-2" />
                <span>{item.contactNumber}</span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.description}
              </p>

              {hotelReviewCount > 0 && (
                <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span>{hotelReviewCount} review{hotelReviewCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'vehicle':
        const vehicleAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const vehicleReviewCount = item.reviews_count || item.reviewCount || 0;
  
        return (
          <div key={item.id} className={cardClass} onClick={() => handleCardClick(item)} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative h-48 overflow-hidden group">
              <img 
                src={getVehicleImage(item)} 
                alt={item.vehicleName} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-vehicle.jpg';
                }}
              />

              {item?.pricePerDay && (
                <div className="absolute bottom-2 right-2 bg-emerald-900 text-white rounded-lg px-2 py-1">
                  <div className="flex items-center gap-1">
                    <CircleDollarSign className="size-4" />
                    <span className="text-xs">LKR. {item.pricePerDay}/day</span>
                  </div>
                </div>
              )}
              {item?.withDriver && (
                <div className="absolute bottom-2 left-2 bg-cyan-900 text-white rounded-lg px-2 py-1">
                  <div className="flex items-center gap-1">
                    <UserCheck className="size-4" />
                    <span className="text-xs">{item.withDriver}</span>
                  </div>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                {item.vehicleType}
              </div>

              {/* Rating Badge */}
              {vehicleAvgRating > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full flex items-center">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span className="text-xs text-white font-semibold">{vehicleAvgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.vehicleName}</h3>
                <span className="font-normal text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded whitespace-nowrap">
                  {item.vehicleNumber}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-600 text-sm mb-3">
                <div className="flex items-center">
                  <Fuel className="size-4 mr-2" />
                  <span>{item.fuelType}</span>
                </div>
                <div className="flex items-center">
                  <Gauge className="size-4 mr-2" />
                  <span>{item.mileagePerDay}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.description}
              </p>

              {vehicleReviewCount > 0 && (
                <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <Star size={12} className="text-yellow-400 fill-current mr-1" />
                  <span>{vehicleReviewCount} review{vehicleReviewCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (processedData.length === 0) return null;

  return (
    <section id={id} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto"></div>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="size-6 text-gray-600" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedData.slice(currentIndex, currentIndex + 3).map((item, index) => renderCard(item, index))}
          </div>
        </div>

        {/* See More Button */}
        <div className="text-center mt-12">
          <button 
            onClick={handleSeeMore}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
          >
            See More {title}
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(processedData.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`size-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / 3) === index
                  ? 'bg-orange-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;