import React from 'react';
import { GlobeIcon, Star } from 'lucide-react';
import styles from '../../styles/InitialPages.module.css';
import { useNavigate } from 'react-router-dom';

export const LocationCard = ({ location, rating = 0, reviewCount = 0, animationDelay = 0, isClickable = true }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isClickable) {
      navigate(`/locations/${location.id}`);
    }
  };

  // Function to determine category based on location name or description
  const getCategory = () => {
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
    
    return 'other';
  };

  const category = getCategory();
  
  const getFirstImage = () => {
    if (location.images && location.images.length > 0) {
      return `http://localhost:8000/storage/${location.images[0].image_path}`;
    } else {
      return '/default-location.jpg';
    }
  };

  const imageUrl = getFirstImage();

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
          src={imageUrl}
          alt={location.locationName || "Location"}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${styles.cardImage}`}
          onError={(e) => {
            e.target.src = '/default-location.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 ${styles.categoryBadge}`}>
          {category}
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
        <h3 className={`text-xl font-bold text-gray-900 line-clamp-1 ${styles.cardTitle}`}>
          {location.locationName}
        </h3>
        
        {/* Province */}
        <div className={`flex items-center text-gray-600 ${styles.entityInfo}`}>
          <GlobeIcon size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{location.province} Province</span>
        </div>

        <p className={`text-gray-600 text-sm line-clamp-3 leading-relaxed ${styles.description} mt-2 mb-3`}>
          {location.shortDescription}
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

export default LocationCard;