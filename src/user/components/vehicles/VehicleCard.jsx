import React from 'react';
import { Star, Fuel, UserCheck, Gauge, CircleDollarSign } from 'lucide-react';
import styles from '../../styles/InitialPages.module.css';
import { getVehicleImageUrls, getMainVehicleImage } from '../../../helpers/ImageHelpers';
import { useNavigate } from 'react-router-dom';

export const VehicleCard = ({ vehicle, rating = 0, reviewCount = 0, animationDelay = 0, isClickable = true }) => {
  const navigate = useNavigate();
    
  const handleClick = () => {
    if (isClickable) {
      navigate(`/vehicles/${vehicle.id}`);
    }
  };

  const imageUrls = getVehicleImageUrls(vehicle);
  const mainImage = getMainVehicleImage(vehicle);

  // Handle both string and number ratings
  const safeRating = typeof rating === 'number' ? rating : 
                    typeof rating === 'string' ? parseFloat(rating) : 0;
  const hasRating = safeRating > 0;
  const displayRating = safeRating.toFixed(1);

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${styles.entityCard} ${styles.animateSlideInCard}`}
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={mainImage}
          alt={vehicle.vehicleName || "Vehicle"}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${styles.cardImage}`}
          onError={(e) => {
            e.target.src = "/default-vehicle.jpg";
          }}
        />
        {vehicle?.pricePerDay && (
          <div className="absolute bottom-2 right-2 bg-emerald-900 text-white rounded-lg px-2 py-1">
            <div className="flex items-center gap-1">
              <CircleDollarSign className="size-4" />
              <span className="text-xs">LKR. {vehicle.pricePerDay}/day</span>
            </div>
          </div>
        )}
        {vehicle?.withDriver && (
          <div className="absolute bottom-2 left-2 bg-cyan-900 text-white rounded-lg px-2 py-1">
            <div className="flex items-center gap-1">
              <UserCheck className="size-4" />
              <span className="text-xs">{vehicle.withDriver}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 ${styles.categoryBadge}`}>
          {vehicle.vehicleType}
        </div>

        {/* Rating Badge - Only show if rating exists */}
        {hasRating && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full flex items-center">
            <Star size={14} className="text-yellow-400 fill-current mr-1" />
            <span className="text-xs text-white font-semibold">{displayRating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <h3 className={`flex justify-between text-xl font-bold text-gray-900 line-clamp-1 ${styles.cardTitle}`}>
          {vehicle.vehicleName}
          <span className="font-normal text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
            {vehicle.vehicleNumber}
          </span>
        </h3>

        <div className={`flex items-center justify-between text-gray-600 ${styles.entityInfo}`}>
          {vehicle?.fuelType && (
            <div className="flex items-center">
              <Fuel size={16} className="mr-2 flex-shrink-0" />
              <span>{vehicle.fuelType}</span>
            </div>
          )}
          {vehicle?.mileagePerDay && (
            <div className="flex items-center">
              <Gauge size={16} className="mr-2 flex-shrink-0" />
              <span>{vehicle.mileagePerDay}</span>
            </div>
          )}
        </div>

        <p className={`text-gray-600 text-sm line-clamp-3 leading-relaxed ${styles.description} mt-2 mb-3`}>
          {vehicle.description}
        </p>

        {/* Show review count if available */}
        {reviewCount > 0 && (
          <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
            <Star size={14} className="text-yellow-400 fill-current mr-1" />
            <span>{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 ${styles.hoverOverlay}`}></div>
    </div>
  );
};

export default VehicleCard;