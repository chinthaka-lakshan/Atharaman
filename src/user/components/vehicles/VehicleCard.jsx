import React from 'react';
import { Star, Fuel, UserCheck, Gauge, CircleDollarSign, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getVehicleImageUrls, getMainVehicleImage } from '../../../helpers/ImageHelpers';
import { useNavigate } from 'react-router-dom';

export const VehicleCard = ({ vehicle, rating = 0, onClick }) => {
  const navigate = useNavigate();
    
  const mainImage = getMainVehicleImage(vehicle);
  const safeRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;

  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8 }}
          src={mainImage}
          alt={vehicle.vehicle_name || vehicle.vehicleName || "Vehicle"}
          className="w-full h-full object-cover transition-transform duration-700"
          onError={(e) => {
            e.target.src = "https://images.pexels.com/photos/1119487/pexels-photo-1119487.jpeg?auto=compress&cs=tinysrgb&w=800";
          }}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Top Badges */}
        <div className="absolute top-5 left-5">
          <div className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-500/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
            <Compass size={12} />
            <span>Ready for Trek</span>
          </div>
        </div>

        {/* Rating Badge */}
        {safeRating > 0 && (
          <div className="absolute top-5 right-5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl flex items-center shadow-lg">
            <Star size={12} className="text-orange-500 fill-current mr-1" />
            <span className="text-xs text-gray-900 font-bold">{safeRating.toFixed(1)}</span>
          </div>
        )}

        {/* Pricing Overlay */}
        <div className="absolute bottom-5 left-5 flex items-center space-x-2">
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl text-white text-xs font-bold border border-white/10">
            LKR {vehicle.price_per_day || vehicle.pricePerDay}/day
          </div>
          {(vehicle?.driver_status || vehicle?.withDriver) && (
            <div className="px-3 py-1.5 bg-cyan-500/80 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-wider">
              + Driver
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="px-3 py-1 bg-cyan-50 rounded-lg text-[10px] font-bold text-cyan-600 uppercase tracking-widest">
            {vehicle.vehicle_type || vehicle.vehicleType}
          </div>
          <span className="text-[10px] font-medium text-gray-400 font-mono">
            {vehicle.reg_number || vehicle.vehicleNumber}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-1">
          {vehicle.vehicle_name || vehicle.vehicleName}
        </h3>

        <div className="flex items-center space-x-4 mb-6 pt-2">
           <div className="flex items-center text-gray-400">
             <Fuel size={14} className="mr-1.5 text-cyan-500" />
             <span className="text-xs font-medium">{vehicle.fuel_type || vehicle.fuelType || "Petrol"}</span>
           </div>
           <div className="flex items-center text-gray-400">
             <Gauge size={14} className="mr-1.5 text-cyan-500" />
             <span className="text-xs font-medium">{vehicle.mileage_per_day || vehicle.mileagePerDay || "100"} km/day</span>
           </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-8 flex-1">
          {vehicle.short_description || vehicle.description || "The ultimate off-road companion, ready to take you through rugged terrains and scenic island routes."}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
             <UserCheck size={12} className="mr-1.5 text-emerald-500" />
             Maintenance Verified
          </div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center text-cyan-600 font-bold text-sm"
          >
            Rent Now <ArrowRight size={16} className="ml-1.5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;