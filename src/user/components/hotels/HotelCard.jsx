import React from 'react';
import { MapPinned, Star, Phone, Home, ArrowRight, Wifi, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { getHotelImageUrls, getMainHotelImage } from '../../../helpers/ImageHelpers';
import { useNavigate } from 'react-router-dom';

export const HotelCard = ({ hotel, rating = 0, onClick }) => {
  const navigate = useNavigate();
    
  const mainImage = getMainHotelImage(hotel);
  const safeRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;

  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8 }}
          src={mainImage}
          alt={hotel.hotel_name || hotel.hotelName || "Hotel"}
          className="w-full h-full object-cover transition-transform duration-700"
          onError={(e) => {
            e.target.src = "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=800";
          }}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Top Badges */}
        <div className="absolute top-5 left-5">
          <div className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
            <Home size={12} />
            <span>Eco-Friendly</span>
          </div>
        </div>

        {/* Rating Badge */}
        {safeRating > 0 && (
          <div className="absolute top-5 right-5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl flex items-center shadow-lg">
            <Star size={12} className="text-orange-500 fill-current mr-1" />
            <span className="text-xs text-gray-900 font-bold">{safeRating.toFixed(1)}</span>
          </div>
        )}

        {/* Amenities Icons */}
        <div className="absolute bottom-5 right-5 flex space-x-2">
           <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
             <Wifi size={14} />
           </div>
           <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
             <Coffee size={14} />
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center space-x-2 text-gray-400 mb-3">
          <MapPinned size={14} className="group-hover:text-emerald-500 transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-widest truncate">
            {hotel.hotel_address || hotel.hotelAddress}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-500 transition-colors line-clamp-1">
          {hotel.hotel_name || hotel.hotelName}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
          {hotel.short_description || hotel.description || "Experience serenity in the heart of nature with our thoughtfully designed eco-friendly accommodations."}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center space-x-2 text-gray-400">
             <Phone size={14} className="text-emerald-500" />
             <span className="text-xs font-medium">{hotel.contact_number || hotel.contactNumber}</span>
          </div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center text-emerald-600 font-bold text-sm"
          >
            Details <ArrowRight size={16} className="ml-1.5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;