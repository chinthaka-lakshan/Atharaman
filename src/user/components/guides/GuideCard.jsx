import React from 'react';
import { Star, Phone } from 'lucide-react';
import styles from '../../styles/InitialPages.module.css';
import { useNavigate } from 'react-router-dom';
import { STORAGE_BASE_URL } from '../../../config/runtimeConfig';

export const GuideCard = ({ guide, rating = 0, reviewCount = 0, animationDelay = 0, isClickable = true }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (isClickable) {
      navigate(`/guides/${guide.id}`);
    }
  };

  const getFirstImage = () => {
    if (guide.images && guide.images.length > 0) {
      const path = guide.images[0].image_path;
      return path.startsWith('http') ? path : `${STORAGE_BASE_URL}/${path}`;
    } else {
      return '/default-guide.jpg';
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
          alt={guide.guide_name || "Guide"}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${styles.cardImage}`}
          onError={(e) => {
            e.target.src = '/default-guide.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

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
          {guide.guide_name}
        </h3>

        <div className={`flex items-center text-gray-600 ${styles.entityInfo}`}>
          <Phone size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{guide.contact_number}</span>
        </div>
        
        <p className={`text-gray-600 text-sm line-clamp-3 leading-relaxed ${styles.description} mt-2 mb-3`}>
          {guide.short_description}
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

export default GuideCard;