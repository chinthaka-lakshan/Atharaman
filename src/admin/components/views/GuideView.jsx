import React from 'react';
import { Mail, Phone, Languages, MapPin, User, IdCardIcon, Image as ImageIcon, Calendar } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

const GuideView = ({ guide }) => {
  if (!guide) return <div>No guide data available</div>;

  // Image URL helper
  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
  };

  // Get all images from the relationship
  const allImages = guide.images || [];

  // Extract languages and locations from guide object
  const languages = guide.languages || [];
  const locations = guide.locations || [];

  // Format date of birth
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Guide Header */}
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
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{guide.guide_name}</h3>
          <p className="text-gray-600 mb-4">{guide.short_description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-500">
              <User className="w-4 h-4 mr-2" />
              <span>User ID: {guide.user_id}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <IdCardIcon className="w-4 h-4 mr-2" />
              <span>{guide.guide_nic}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(guide.guide_dob)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="font-medium mr-2">Gender:</span>
              <span>{guide.guide_gender}</span>
            </div>
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

      {/* Address */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Address</h4>
        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{guide.guide_address}</p>
      </div>

      {/* Long Description */}
      {guide.long_description && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Detailed Description</h4>
          <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-lg">
            {guide.long_description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{guide.business_mail}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{guide.contact_number}</span>
            </div>
            {guide.whatsapp_number && (
              <div className="flex items-center">
                <FaWhatsapp className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-700">{guide.whatsapp_number}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {languages.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Languages className="w-5 h-5 mr-2" />
            Languages Spoken
          </h4>
          <div className="flex flex-wrap gap-2">
            {languages.map((language, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}

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

export default GuideView;