import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Globe, CircleDollarSign, UserCheck, Star, Phone, MapPinned, Fuel, Gauge, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  getMainLocationImage, 
  getMainGuideImage, 
  getMainShopImage, 
  getMainHotelImage, 
  getMainVehicleImage
} from '../../helpers/ImageHelpers';

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
      
      // Take only top 8 items
      sortedData = sortedData.slice(0, 8);
    }
    
    return sortedData;
  }, [data, type]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || processedData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 4 >= processedData.length ? 0 : prevIndex + 4
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [processedData.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 >= processedData.length ? 0 : prevIndex + 4
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 4 < 0 ? Math.max(0, Math.floor((processedData.length - 1) / 4) * 4) : prevIndex - 4
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
    const type = (location.location_type || location.locationType || '').toLowerCase();
    const name = (location.location_name || location.locationName || '').toLowerCase();
    
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
    return getMainLocationImage(location);
  };

  // Get image URL for guides
  const getGuideImage = (guide) => {
    return getMainGuideImage(guide);
  };

  // Get image URL for shops
  const getShopImage = (shop) => {
    return getMainShopImage(shop);
  };

  // Get image URL for hotels
  const getHotelImage = (hotel) => {
    return getMainHotelImage(hotel);
  };

  // Get image URL for vehicles
  const getVehicleImage = (vehicle) => {
    return getMainVehicleImage(vehicle);
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
    const cardClass = "group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100";
    
    switch (type) {
      case 'location':
        const locationAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const locationReviewCount = item.reviews_count || item.reviewCount || 0;
        const category = getCategory(item);
        
        return (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={cardClass} 
            onClick={() => handleCardClick(item)} 
          >
            <div className="relative h-72 overflow-hidden">
              <img 
                src={getLocationImage(item)} 
                alt={item.location_name || item.locationName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
                onError={(e) => { e.target.src = '/default-location.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                  {category}
                </span>
              </div>

              {locationAvgRating > 0 && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 bg-orange-500 rounded-full shadow-lg">
                  <Star size={10} className="text-white fill-current" />
                  <span className="text-[10px] text-white font-black">{locationAvgRating.toFixed(1)}</span>
                </div>
              )}

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center text-white/90 text-[10px] font-black uppercase tracking-widest mb-2">
                  <Globe className="size-3 mr-2 text-orange-400" />
                  {item.province}
                </div>
                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-orange-400 transition-colors">
                  {item.location_name || item.locationName}
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed italic">
                "{item.short_description || item.shortDescription || item.description}"
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {locationReviewCount} Experiences
                </span>
                <div className="size-8 rounded-full bg-gray-900 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'guide':
        const guideAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const guideReviewCount = item.reviews_count || item.reviewCount || 0;
        
        return (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={cardClass} 
            onClick={() => handleCardClick(item)} 
          >
            <div className="relative h-72 overflow-hidden">
              <img 
                src={getGuideImage(item)} 
                alt={item.guide_name || item.guideName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
                onError={(e) => { e.target.src = '/default-guide.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-60"></div>
              
              {/* Specialist Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Local Expert
                </span>
              </div>

              {guideAvgRating > 0 && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                  <Star size={10} className="text-yellow-400 fill-current" />
                  <span className="text-[10px] text-white font-black">{guideAvgRating.toFixed(1)}</span>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white mb-1">{item.guide_name || item.guideName}</h3>
                <div className="flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  <UserCheck className="size-3 mr-2" />
                  Verified Guide
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-gray-700 text-xs font-bold mb-4 bg-gray-50 w-fit px-4 py-2 rounded-xl border border-gray-100">
                <Phone className="size-3 mr-2 text-emerald-600" />
                {item.contact_number || item.contactNumber || item.personal_number || item.personalNumber}
              </div>
              
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed italic">
                "{item.short_description || item.description}"
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {guideReviewCount} Reviews
                </span>
                <div className="size-8 rounded-full bg-emerald-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'shop':
        const shopAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const shopReviewCount = item.reviews_count || item.reviewCount || 0;

        return (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -12 }}
            transition={{ delay: index * 0.1 }}
            className={cardClass} 
            onClick={() => handleCardClick(item)} 
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={getShopImage(item)} 
                alt={item.shop_name || item.shopName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
                onError={(e) => { e.target.src = '/default-shop.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center text-orange-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  <MapPinned className="size-3 mr-2" />
                  Premium Shop
                </div>
                <h3 className="text-xl font-bold text-white line-clamp-1">{item.shop_name || item.shopName}</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed italic">
                "{item.short_description || item.description}"
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="flex items-center">
                  {renderStars(shopAvgRating)}
                  <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {shopReviewCount} REVIEWS
                  </span>
                </div>
                <div className="size-8 rounded-full bg-orange-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'hotel':
        const hotelAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const hotelReviewCount = item.reviews_count || item.reviewCount || 0;

        return (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -12 }}
            transition={{ delay: index * 0.1 }}
            className={cardClass} 
            onClick={() => handleCardClick(item)} 
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={getHotelImage(item)} 
                alt={item.hotel_name || item.hotelName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
                onError={(e) => { e.target.src = '/default-hotel.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

              {hotelAvgRating > 0 && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <Star size={10} className="text-yellow-400 fill-current" />
                  <span className="text-[10px] text-white font-black">{hotelAvgRating.toFixed(1)}</span>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                  {item.hotel_name || item.hotelName}
                </h3>
                <div className="flex items-center text-white/70 text-[10px] uppercase font-bold tracking-widest">
                  <MapPinned className="size-3 mr-2 text-emerald-400" />
                  {item.hotel_address || item.hotelAddress}
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed italic">
                "{item.short_description || item.description}"
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-emerald-600 font-bold text-sm">Luxury Stay</span>
                <div className="size-8 rounded-full bg-emerald-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'vehicle':
        const vehicleAvgRating = parseRating(item.reviews_avg_rating || item.averageRating);
        const vehicleReviewCount = item.reviews_count || item.reviewCount || 0;
  
        return (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -12 }}
            transition={{ delay: index * 0.1 }}
            className={cardClass} 
            onClick={() => handleCardClick(item)} 
          >
            <div className="relative h-64 overflow-hidden shadow-inner">
              <img 
                src={getVehicleImage(item)} 
                alt={item.vehicle_name || item.vehicleName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy"
                onError={(e) => { e.target.src = '/default-vehicle.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 text-gray-900 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {item.vehicle_type || item.vehicleType}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="px-2 py-1 bg-orange-500 text-white rounded text-[10px] font-black uppercase tracking-widest">
                    {item.fuel_type || item.fuelType}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{item.vehicle_name || item.vehicleName}</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-800">
                  <CircleDollarSign className="size-4 mr-2 text-emerald-600" />
                  <span className="font-bold text-base">LKR {item.price_per_day || item.pricePerDay}</span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">/ Day</span>
                </div>
                <div className="flex items-center text-gray-400 text-[10px] font-black border border-gray-100 px-2 py-1 rounded-lg">
                  <Gauge className="size-3 mr-1" />
                  {item.mileage_per_day || item.mileagePerDay} KM
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="flex items-center text-emerald-600">
                  <UserCheck className="size-3 mr-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">With Driver</span>
                </div>
                <div className="size-8 rounded-full bg-gray-900 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (processedData.length === 0) return null;

  return (
    <section id={id} className="py-20 relative overflow-hidden">
      {/* Natural Ambient Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.05] rounded-full blur-[120px] ${
          type === 'location' ? 'bg-orange-400' : 
          type === 'guide' ? 'bg-emerald-400' : 
          type === 'shop' ? 'bg-sky-400' : 
          type === 'hotel' ? 'bg-indigo-400' : 'bg-rose-400'
        }`}></div>
      </div>

      <div className="max-w-full px-6 lg:px-12 mx-auto relative z-10">
        <div className="mb-16 text-left border-l-8 border-orange-500 pl-8">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[10px] uppercase font-black tracking-[0.4em] text-orange-500 mb-2 block"
          >
            Handpicked
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">{title}</h2>
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

          {/* Cards Grid with Staggered Animations */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {processedData.slice(currentIndex, currentIndex + 4).map((item, index) => renderCard(item, index))}
          </motion.div>
        </div>

        {/* See More Button */}
        <div className="text-center mt-20">
          <button 
            onClick={handleSeeMore}
            className="inline-flex items-center space-x-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all duration-300 shadow-xl group"
          >
            <span>Explore All {title}</span>
            <TrendingUp size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(processedData.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 4)}
              className={`size-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / 4) === index
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