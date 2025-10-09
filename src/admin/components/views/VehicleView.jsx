import React from 'react';
import { CarFront, IdCard, Calendar, UserCheck, Fuel, User, Gauge, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

const VehicleView = ({ vehicle }) => {
  if (!vehicle) return <div>No vehicle data available</div>;

  // Image URL helper
  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
  };

  // Get all images from the relationship
  const allImages = vehicle.images || [];

  // Extract locations from hotel object
  const locations = vehicle.locations || [];

  return (
    <div className="space-y-6">
      {/* Vehicle Header */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-48 flex-shrink-0">
          {allImages.length > 0 ? (
            <img
              src={getImageUrl(allImages[0].image_path)}
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
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.vehicle_name}</h3>
          <p className="text-gray-600 mb-4">{vehicle.short_description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-500">
              <CarFront className="w-4 h-4 mr-2" />
              <span>{vehicle.vehicle_type}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <IdCard className="w-4 h-4 mr-2" />
              <span>{vehicle.reg_number}</span>
            </div>
            {vehicle.manufactured_year && (
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{vehicle.manufactured_year}</span>
              </div>
            )}
            {vehicle.no_of_passengers && (
              <div className="flex items-center text-gray-500">
                <User className="w-4 h-4 mr-2" />
                <span>Passengers: {vehicle.no_of_passengers}</span>
              </div>
            )}
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
                  src={getImageUrl(img.image_path)}
                  alt={img.alt_text}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Long Description */}
      {vehicle.long_description && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Detailed Description</h4>
          <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-lg">
            {vehicle.long_description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <IdCard className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{vehicle.reg_number}</span>
            </div>
            {vehicle.manufactured_year && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-700">Year {vehicle.manufactured_year}</span>
              </div>
            )}
            {vehicle.no_of_passengers && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-700">{vehicle.no_of_passengers} Passengers</span>
              </div>
            )}
            {vehicle.fuel_type && (
              <div className="flex items-center">
                <Fuel className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-700">{vehicle.fuel_type}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Booking Information</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <UserCheck className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{vehicle.driver_status}</span>
            </div>
            {vehicle.price_per_day && (
              <div className="flex items-center">
                <span className="w-4 h-5 mb-1 mr-5 text-gray-400">LKR.</span>
                <span className="text-gray-700">{vehicle.price_per_day}/Day</span>
              </div>
            )}
            {vehicle.mileage_per_day && (
              <div className="flex items-center">
                <Gauge className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-700">{vehicle.mileage_per_day} km/Day</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Locations */}
      {locations.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Service Locations
          </h4>
          <div className="flex flex-wrap gap-2">
            {locations.map((location, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {location}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleView;