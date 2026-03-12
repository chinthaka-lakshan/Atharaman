import React from 'react';
import { Globe, Image as ImageIcon, Mountain } from 'lucide-react';

const LocationView = ({ location }) => {
  if (!location) return <div>No location data available</div>;;

  // Get all images from the relationship
  const allImages = location.images || [];

  return (
    <div className="space-y-6">
      {/* Location Header */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-48 flex-shrink-0">
          {allImages.length > 0 ? (
            <img
              src={`http://localhost:8000/storage/${allImages[0].image_path}`}
              alt={allImages[0].alt_text}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{location.locationName}</h3>
          <p className="text-gray-600 mb-4">{location.shortDescription}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Globe className="w-4 h-4 mr-1" />
            <span>{location.province} Province</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Mountain className="w-4 h-4 mr-1" />
            <span>{location.locationType}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <span>Coordinates: {location.latitude}, {location.longitude}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {allImages.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allImages.map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={`http://localhost:8000/storage/${img.image_path}`}
                  alt={img.alt_text}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
        <p className="text-gray-700 leading-relaxed">{location.longDescription}</p>
      </div>
    </div>
  );
};

export default LocationView;