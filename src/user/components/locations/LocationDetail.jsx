import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Star, 
  MapPin, Wind, Cloud, Droplets, 
  Globe, Compass, Mountain, Map as MapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherWidget from './WeatherWidget';
import LocationMap from './LocationMap';
import Navbar from '../Navbar';
import ReviewSection from '../ReviewSection';
import { getRelatedData } from '../../../services/api';
import { GuideCard } from '../guides/GuideCard';
import { ShopCard } from '../shops/ShopCard';
import { HotelCard } from '../hotels/HotelCard';
import { VehicleCard } from '../vehicles/VehicleCard';
import { STORAGE_BASE_URL } from '../../../config/runtimeConfig';

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
  const navigate = useNavigate();

  // Normalize image data
  const getImages = () => {
    if (location.images && location.images.length > 0) {
      return location.images.map(img => img.image_path);
    }
    return [];
  };

  const images = getImages();

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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/locations');
    }
  };

  const nextImage = () => {
    if (images.length) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (images.length) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleDirections = () => {
    if (location?.latitude && location?.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`, "_blank");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!location) return null;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      
      {/* Global Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={images.length > 0 ? `${STORAGE_BASE_URL}/${images[currentImageIndex]}` : '/placeholder-location.jpg'}
            alt={location.locationName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-24 left-24 z-30 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-24 left-24 right-24 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/30">
                {location.locationType || 'Destinations'}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)} ({reviewCount} Reviews)
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight">
              {location.locationName}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl font-medium leading-relaxed">
              {location.shortDescription}
            </p>
          </motion.div>
        </div>

        {/* Image Nav Buttons */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage} 
              className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 relative -mt-12 z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* About Section */}
            <motion.section 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-orange-100 rounded-2xl text-orange-600">
                  <Compass className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Experience the Magic</h2>
                  <p className="text-gray-500 font-medium">Everything you need to know about {location.locationName}</p>
                </div>
              </div>
              <div className="prose prose-lg prose-orange max-w-none text-gray-700 leading-relaxed space-y-6">
                <p className="text-xl font-medium leading-relaxed">
                  {location.longDescription}
                </p>
              </div>
            </motion.section>

            {/* Interactive Map Section */}
            <motion.section 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/50 h-[500px] overflow-hidden"
            >
              <div className="w-full h-full rounded-[2rem] overflow-hidden">
                <LocationMap
                  latitude={location.latitude}
                  longitude={location.longitude}
                  name={location.locationName}
                />
              </div>
            </motion.section>

          </div>

          {/* Right Column - Sidebar Widgets */}
          <aside className="lg:col-span-4 space-y-8">
            {/* High-Tech Weather Widget */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <WeatherWidget location={{ latitude: location.latitude, longitude: location.longitude }} />
              
              {/* Quick Info Grid */}
              <div className="mt-8 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Travel Pass
                </h3>
                <div className="space-y-4">
                  <InfoItem icon={<MapPin className="text-red-500" />} label="Province" value={location.province} />
                  <InfoItem icon={<Mountain className="text-emerald-500" />} label="Terrain" value={location.locationType} />
                  <InfoItem icon={<Compass className="text-blue-500" />} label="Lat / Long" value={`${location.latitude}, ${location.longitude}`} />
                </div>
                <button 
                  onClick={handleDirections}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-xl shadow-gray-900/10"
                >
                  <MapIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Get Directions
                </button>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Landscape Sections (Full Width) */}
        <div className="mt-16 space-y-16">
          {/* Reviews Section */}
          <motion.section 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Traveler Stories</h2>
                <p className="text-gray-500">Real experiences from our community</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
            <ReviewSection entityType="location" entityId={location?.id} />
          </motion.section>

          {/* Related Entities Tabs/Sections */}
          <div className="space-y-12">
            <EntityGrid title="Expert Area Guides" items={guides} type="guide" loading={loading} />
            <EntityGrid title="Exclusive Accommodations" items={hotels} type="hotel" loading={loading} />
            <EntityGrid title="Artisanal Finds" items={shops} type="shop" loading={loading} />
            <EntityGrid title="Adventure Rides" items={vehicles} type="vehicle" loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none mb-1">{label}</p>
        <p className="text-gray-900 font-bold leading-none">{value || 'Not Specified'}</p>
      </div>
    </div>
  </div>
);

const EntityGrid = ({ title, items, type, loading }) => {
  if (!loading && items.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
        <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">{items.length} Options</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-[2.5rem]" />
          ))
        ) : (
          items.map(item => (
            <div key={item.id} className="transform hover:scale-[1.02] transition-all duration-300">
              {type === 'guide' && <GuideCard guide={item} rating={item.reviews_avg_rating || 0} reviewCount={item.reviews_count || 0} isClickable={false} />}
              {type === 'hotel' && <HotelCard hotel={item} rating={item.reviews_avg_rating || 0} reviewCount={item.reviews_count || 0} isClickable={false} />}
              {type === 'shop' && <ShopCard shop={item} rating={item.reviews_avg_rating || 0} reviewCount={item.reviews_count || 0} isClickable={false} />}
              {type === 'vehicle' && <VehicleCard vehicle={item} rating={item.reviews_avg_rating || 0} reviewCount={item.reviews_count || 0} isClickable={false} />}
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
};

export default LocationDetail;