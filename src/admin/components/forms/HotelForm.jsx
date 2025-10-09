import React, { useState, useEffect } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { getLocations } from '../../../services/api';

const HotelForm = ({ hotel, onSave, onCancel, selectedOwner, submitting = false }) => {
  const [formData, setFormData] = useState({
    hotel_name: hotel?.hotel_name || '',
    nearest_city: hotel?.nearest_city || '',
    hotel_address: hotel?.hotel_address || '',
    business_mail: hotel?.business_mail || '',
    contact_number: hotel?.contact_number || '',
    whatsapp_number: hotel?.whatsapp_number || '',
    short_description: hotel?.short_description || '',
    long_description: hotel?.long_description || '',
    locations: hotel?.locations || [],
    user_id: hotel?.user_id || selectedOwner?.user_id || '',
    hotel_owner_id: hotel?.hotel_owner_id || selectedOwner?.id || '',
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(hotel?.images || []);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const cityOptions = ['Colombo', 'Ratnapura', 'Kandy', 'Jaffna', 'Galle', 'Gampaha'];

  // Add useEffect to ensure user_id is set
  useEffect(() => {
    if (selectedOwner && !hotel) {
      setFormData(prev => ({
        ...prev,
        user_id: selectedOwner.user_id,
        hotel_owner_id: selectedOwner.id
      }));
    }
  }, [selectedOwner, hotel]);

  useEffect(() => {
    if (hotel) {
      setExistingImages(hotel.images || []);
      setImagesToRemove([]);
      setNewImages([]);
    }
  }, [hotel]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLocationLoading(true);
    setLocationError('');
    try {
      const response = await getLocations();
      
      if (Array.isArray(response.data)) {
        setAvailableLocations(response.data);
      } else {
        console.error('Unexpected API response structure for locations:', response.data);
        setLocationError('Unexpected data format from server');
        setAvailableLocations([]);
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setLocationError('Failed to load locations. Please try again.');
      setAvailableLocations([]);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (locationName) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(locationName)
        ? prev.locations.filter(l => l !== locationName)
        : [...prev.locations, locationName]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and sizes before adding
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024;
      
      if (!isValidType) {
        alert(`File "${file.name}" has an invalid format. Please use JPEG, PNG, GIF, or WEBP.`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`File "${file.name}" is too large. Maximum size is 2MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    const currentImageCount = existingImages.length - imagesToRemove.length;
    const totalAfterAdd = currentImageCount + newImages.length + validFiles.length;
    
    if (totalAfterAdd > 5) {
      alert(`Maximum 5 images allowed. You currently have ${currentImageCount + newImages.length} images.`);
      return;
    }
    
    setNewImages(prev => [...prev, ...validFiles]);
    e.target.value = ''; // Reset file input
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    const image = existingImages.find(img => img.id === imageId);
    if (image) {
      setImagesToRemove(prev => [...prev, imageId]);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const restoreExistingImage = (imageId) => {
    setImagesToRemove(prev => prev.filter(id => id !== imageId));
    if (hotel) {
      const originalImage = hotel.images.find(img => img.id === imageId);
      if (originalImage) {
        setExistingImages(prev => [...prev, originalImage]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    formDataObj.append('hotel_name', formData.hotel_name);
    formDataObj.append('nearest_city', formData.nearest_city);
    formDataObj.append('hotel_address', formData.hotel_address || '');
    formDataObj.append('business_mail', formData.business_mail || '');
    formDataObj.append('contact_number', formData.contact_number);
    formDataObj.append('whatsapp_number', formData.whatsapp_number || '');
    formDataObj.append('short_description', formData.short_description);
    formDataObj.append('long_description', formData.long_description || '');
    formDataObj.append('user_id', formData.user_id);
    formDataObj.append('hotel_owner_id', formData.hotel_owner_id);

    if (formData.locations && formData.locations.length > 0) {
      formData.locations.forEach(locationName => {
        formDataObj.append('locations[]', locationName);
      });
    }

    // Append each new image file
    newImages.forEach(img => {
      formDataObj.append('hotelImage[]', img);
    });

    // Append images to remove (for edit mode)
    if (hotel && imagesToRemove.length > 0) {
      imagesToRemove.forEach(imageId => {
        formDataObj.append('removedImages[]', imageId);
      });
    }

    // Add method spoofing for PUT
    if (hotel) {
      formDataObj.append('_method', 'PUT');
    }

    try {
      await onSave(formDataObj);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining image slots
  const currentImageCount = existingImages.length - imagesToRemove.length;
  const totalImages = currentImageCount + newImages.length;
  const remainingSlots = Math.max(0, 5 - totalImages);

  const removedImages = hotel ? hotel.images.filter(img => imagesToRemove.includes(img.id)) : [];

  // Image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/fallback-image.jpg';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Name *
          </label>
          <input
            type="text"
            name="hotel_name"
            value={formData.hotel_name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter hotel name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nearest City *
          </label>
          <select
            name="nearest_city"
            value={formData.nearest_city}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Nearest City</option>
            {cityOptions.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hotel Address *
        </label>
        <textarea
          name="hotel_address"
          value={formData.hotel_address}
          onChange={handleInputChange}
          rows="1"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter hotel address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Email
        </label>
        <input
          type="email"
          name="business_mail"
          value={formData.business_mail}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter email address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number *
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter contact number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter WhatsApp number (optional)"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images {remainingSlots >= 0 && `(${remainingSlots} remaining)`}
        </label>

        {/* Removed Images Section */}
        {removedImages.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2 font-medium">
              {removedImages.length} image{removedImages.length !== 1 ? 's' : ''} marked for removal
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {removedImages.map((img) => (
                <div key={img.id} className="relative h-40 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center opacity-60">
                  <img 
                    src={getImageUrl(img.image_path)}
                    alt={img.alt_text}
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => restoreExistingImage(img.id)}
                    className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 shadow-md hover:bg-green-600"
                    title="Restore image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v0a8 8 0 01-8 8H3" />
                    </svg>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-white text-xs py-1 text-center">
                    Will be removed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Existing Images (click × to remove):</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative h-40 border border-gray-300 rounded-lg flex items-center justify-center group">
                  <img 
                    src={getImageUrl(img.image_path)}
                    alt={img.alt_text}
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{img.order_index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Uploads */}
        {(newImages.length > 0 || remainingSlots > 0) && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">New Images:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newImages.map((img, index) => (
                <div key={`new-${index}`} className="relative h-40 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center bg-green-50">
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={`New ${index}`}
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    New #{index + 1}
                  </div>
                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {Math.round(img.size / 1024)}KB
                  </div>
                </div>
              ))}
              
              {remainingSlots > 0 && (
                <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <label htmlFor="fileInput" className="flex flex-col items-center cursor-pointer p-4 text-center w-full h-full justify-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Add Images</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining
                    </span>
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 space-y-1">
          <p>• Maximum 5 images per hotel</p>
          <p>• Currently using: {totalImages}/5 slots</p>
          <p>• Supported formats: JPEG, JPG, PNG, GIF, WEBP</p>
          <p>• Maximum file size: 2MB per image</p>
          {remainingSlots <= 0 && (
            <p className="text-orange-600 font-medium">Maximum 5 images reached.</p>
          )}
        </div>

        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Image Summary:</strong> {existingImages.length} existing ({imagesToRemove.length} marked for removal) + {newImages.length} new = {totalImages} total images
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description *
        </label>
        <textarea
          name="short_description"
          value={formData.short_description}
          onChange={handleInputChange}
          rows="3"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of the hotel"
          maxLength="1000"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.short_description.length}/1000 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Description
        </label>
        <textarea
          name="long_description"
          value={formData.long_description}
          onChange={handleInputChange}
          rows="5"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Detailed description of the hotel (optional)"
          maxLength="10000"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.long_description?.length || 0}/10000 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Locations
        </label>
        {locationLoading ? (
          <div className="text-gray-500 text-sm">Loading locations...</div>
        ) : locationError ? (
          <div className="text-red-500 text-sm">{locationError}</div>
        ) : availableLocations.length === 0 ? (
          <div className="text-gray-500 text-sm">No locations available</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableLocations.map(location => (
              <label key={location.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(formData.locations || []).includes(location.locationName)}
                  onChange={() => handleLocationChange(location.locationName)}
                  className="mr-2"
                />
                {location.locationName}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || submitting}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || submitting} // Add submitting prop
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 min-w-[80px]"
        >
          {submitting ? <Loader className="w-5 h-5 animate-spin" /> : (hotel ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default HotelForm;