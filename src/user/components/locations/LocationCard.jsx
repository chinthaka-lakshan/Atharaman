import React from 'react';
import { GlobeIcon, Star, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const LocationCard = ({ location, rating = 0, onClick }) => {
  const navigate = useNavigate();

  const imageUrl = location.images && location.images.length > 0
    ? `http://localhost:8000/storage/${location.images[0].image_path}`
    : 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=800';

  const safeRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;

  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8 }}
          src={imageUrl}
          alt={location.locationName}
          className="w-full h-full object-cover transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Top Badges */}
        <div className="absolute top-5 left-5 flex gap-2">
          <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-800 shadow-lg">
            {location.locationType || 'Destinations'}
          </div>
        </div>

        {/* Rating Badge */}
        {safeRating > 0 && (
          <div className="absolute top-5 right-5 px-3 py-1.5 bg-orange-500/90 backdrop-blur-md rounded-2xl flex items-center shadow-lg">
            <Star size={12} className="text-white fill-current mr-1" />
            <span className="text-xs text-white font-bold">{safeRating.toFixed(1)}</span>
          </div>
        )}

        {/* Location Info Overlay */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center text-white/90 text-[10px] font-bold uppercase tracking-widest">
            <MapPin size={10} className="text-orange-400 mr-1.5" />
            {location.province} Province
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-1">
          {location.locationName}
        </h3>
        
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
          {location.shortDescription || "Discover the hidden beauty and authentic experiences of this breathtaking location."}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                <img src={`https://i.pravatar.cc/100?u=${location.id + i}`} alt="User" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
              +12
            </div>
          </div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center text-orange-500 font-bold text-sm"
          >
            Explore <ArrowRight size={16} className="ml-1.5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationCard;