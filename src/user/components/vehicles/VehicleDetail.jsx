import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Fuel, Gauge, 
  UserCheck, CarFront, CircleDollarSign, 
  IdCard, ChevronLeft, ChevronRight,
  ShieldCheck, Zap, Navigation
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "../Navbar";
import ReviewSection from "../ReviewSection";
import { getLocations } from '../../../services/api';
import { LocationCard } from '../locations/LocationCard';
import { STORAGE_BASE_URL } from '../../../config/runtimeConfig';

export const VehicleDetail = ({ vehicle, onBack }) => {
  const reviews = vehicle.reviews || vehicle.reviews?.data || [];
  const averageRating = vehicle.reviews_avg_rating ? parseFloat(vehicle.reviews_avg_rating) : 0;
  const reviewCount = vehicle.reviews_count || reviews.length;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const images = vehicle.images || [];

  useEffect(() => {
    const fetchVehicleLocations = async () => {
      if (vehicle?.locations && vehicle.locations.length > 0) {
        try {
          setLoading(true);
          const response = await getLocations();
          const allLocations = response.data;
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/vehicles');
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!vehicle) return null;

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
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-amber-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

      {/* Hero Section */}
      <div className="relative h-[65vh] min-h-[450px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={images.length > 0 ? `${STORAGE_BASE_URL}/${images[currentImageIndex]?.image_path}` : '/placeholder-vehicle.jpg'}
            alt={vehicle.vehicle_name || vehicle.vehicleName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-24 left-8 z-30 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Badges/Price Floating */}
        <div className="absolute top-24 right-8 z-30 flex flex-col gap-4">
           {(vehicle?.vehicle_type || vehicle?.vehicleType) && (
              <div className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white flex items-center gap-3 shadow-xl">
                 <CarFront className="w-6 h-6" />
                 <span className="font-bold tracking-wider">{vehicle.vehicle_type || vehicle.vehicleType}</span>
              </div>
           )}
           {(vehicle?.price_per_day || vehicle?.pricePerDay) && (
              <div className="px-6 py-3 bg-orange-500 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-orange-500/30">
                 <CircleDollarSign className="w-6 h-6" />
                 <span className="font-bold text-xl">LKR {vehicle.price_per_day || vehicle.pricePerDay}<span className="text-xs font-normal">/day</span></span>
              </div>
           )}
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-24 left-8 right-8 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-gray-900/30">
                Rugged Explorer
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)} ({reviewCount} Reviews)
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight uppercase">
              {vehicle.vehicle_name || vehicle.vehicleName}
            </h1>
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
            {/* Description Section */}
            <motion.section 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 border-l-orange-500 border-l-4"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-orange-100 rounded-2xl text-orange-600">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 uppercase">Specifications & Bio</h2>
                  <p className="text-gray-500 font-medium tracking-wide">Performance and utility details</p>
                </div>
              </div>
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p className="text-xl font-medium leading-relaxed italic">
                  {vehicle.long_description || vehicle.short_description || vehicle.description}
                </p>
              </div>

              {/* Technical Specs Grid */}
              <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
                 <SpecItem icon={<Fuel className="w-5 h-5" />} label="Fuel" value={vehicle.fuel_type || vehicle.fuelType} />
                 <SpecItem icon={<Gauge className="w-5 h-5" />} label="Mileage" value={`${vehicle.mileage_per_day || vehicle.mileagePerDay}km`} />
                 <SpecItem icon={<UserCheck className="w-5 h-5" />} label="Capacity" value={vehicle.no_of_passengers} />
                 <SpecItem icon={<ShieldCheck className="w-5 h-5" />} label="Driver" value={vehicle.driver_status || vehicle.withDriver} />
              </div>
            </motion.section>

          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-8"
            >
              {/* Quick Info Card */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Base Camp</h3>
                
                <div className="space-y-4">
                  {(vehicle.reg_number || vehicle.vehicleNumber) && <ContactItem icon={<IdCard className="text-orange-500" />} label="Reg Number" value={vehicle.reg_number || vehicle.vehicleNumber} />}
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-orange-600/20 uppercase tracking-widest">
                    Request Booking
                  </button>
                  <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-xl shadow-gray-900/10 uppercase tracking-widest">
                    Inquire Spec
                  </button>
                </div>
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
                <h2 className="text-3xl font-bold text-gray-900">Experience Logs</h2>
                <p className="text-gray-500">Reviews from recent explorers</p>
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
            <ReviewSection entityType="vehicle" entityId={vehicle?.id} />
          </motion.section>

          {/* Available Locations */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Navigation className="w-8 h-8 text-blue-500" /> Operating Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-[2.5rem]" />
                ))
              ) : locations.length > 0 ? (
                locations.map(loc => (
                  <div key={loc.id} className="transform hover:scale-[1.02] transition-all duration-300">
                    <LocationCard location={loc} rating={loc.reviews_avg_rating || 0} reviewCount={loc.reviews_count || 0} isClickable={false} />
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Ready for any terrain.</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

const SpecItem = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 text-gray-600">
    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
    <span className="font-bold text-gray-900 text-sm">{value || 'N/A'}</span>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
    <div className="w-10 h-10 flex items-center justify-center">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none mb-1">{label}</p>
      <p className="text-gray-900 font-bold leading-none truncate">{value}</p>
    </div>
  </div>
);

export default VehicleDetail;