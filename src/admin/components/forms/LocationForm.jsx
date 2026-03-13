import React, { useState, useEffect } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { STORAGE_BASE_URL } from '../../../config/runtimeConfig';

const LocationForm = ({ location, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    locationName: location?.locationName || '',
    locationType: location?.locationType || '',
    province: location?.province || '',
    shortDescription: location?.shortDescription || '',
    longDescription: location?.longDescription || '',
    latitude: location?.latitude || '',
    longitude: location?.longitude || ''
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(location?.images || []);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const provinces = ['Central', 'Eastern', 'North Central', 'Northern', 'North Western', 'Sabaragamuwa', 'Southern', 'Uva', 'Western'];
  const locationTypes = ['Mountain', 'Rock', 'Plain', 'Valley', 'Beach', 'Cliff', 'Desert', 'Forest', 'Coast', 'Temple/Historic Building', 'Lake', 'River', 'Island', 'Road', 'Village'];

  useEffect(() => {
    if (location) {
      setExistingImages(location.images || []);
      setImagesToRemove([]);
      setNewImages([]);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const currentImageCount = existingImages.length - imagesToRemove.length;
    const totalAfterAdd = currentImageCount + newImages.length + files.length;
    
    if (totalAfterAdd > 10) {
      alert(`Maximum 10 images allowed. You currently have ${currentImageCount + newImages.length} images.`);
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
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
    if (location) {
      const originalImage = location.images.find(img => img.id === imageId);
      if (originalImage) {
        setExistingImages(prev => [...prev, originalImage]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Client-side validation for images
    for (let i = 0; i < newImages.length; i++) {
      const img = newImages[i];
      
      // Check file size (2MB limit)
      if (img.size > 2 * 1024 * 1024) {
        alert(`Image "${img.name}" is too large. Maximum size is 2MB.`);
        setLoading(false);
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(img.type)) {
        alert(`Image "${img.name}" has an invalid format. Please use JPEG, PNG, GIF, or WEBP.`);
        setLoading(false);
        return;
      }
    }

    const formDataObj = new FormData();
    
    // Append all form data
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataObj.append(key, formData[key]);
      }
    });
    
    // Append new images
    newImages.forEach((img) => {
      formDataObj.append('locationImage[]', img);
    });

    // Append images to remove (for edit mode)
    if (location && imagesToRemove.length > 0) {
      imagesToRemove.forEach(imageId => {
        formDataObj.append('removedImages[]', imageId);
      });
    }

    // Add method spoofing for PUT
    if (location) {
      formDataObj.append('_method', 'PUT');
    }

    try {
      await onSave(formDataObj);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Error saving location: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining image slots
  const currentImageCount = existingImages.length - imagesToRemove.length;
  const totalImages = currentImageCount + newImages.length;
  const remainingSlots = Math.max(0, 10 - totalImages);

  const removedImages = location ?
    location.images.filter(img => imagesToRemove.includes(img.id)) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Name *
          </label>
          <input
            type="text"
            name="locationName"
            value={formData.locationName}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter location name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province *
          </label>
          <select
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Province</option>
            {provinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Type *
          </label>
          <select
            name="locationType"
            value={formData.locationType}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Location Type</option>
            {locationTypes.map(locationType => (
              <option key={locationType} value={locationType}>{locationType}</option>
            ))}
          </select>
        </div>
      </div>

      {/* -- [START] Location Search Autocomplete -- */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Auto-Search Location (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type a place (e.g. Colombo) to auto-fill..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => {
              const query = e.target.value;
              const dropdown = document.getElementById('location-search-dropdown');
              const loader   = document.getElementById('location-search-loader');
              
              // Clear existing timeout to debounce
              if (window.locationSearchTimeout) clearTimeout(window.locationSearchTimeout);
              
              if (!query.trim()) {
                dropdown.classList.add('hidden');
                loader.classList.add('hidden');
                return;
              }

              // Show loading spinner while they stop typing
              loader.classList.remove('hidden');

              window.locationSearchTimeout = setTimeout(async () => {
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                  const data = await res.json();
                  
                  loader.classList.add('hidden');

                  if (data.length === 0) {
                    dropdown.innerHTML = '<div class="p-3 text-sm text-gray-500">No matching places found.</div>';
                  } else {
                    dropdown.innerHTML = '';
                    data.slice(0, 5).forEach(item => {
                      const div = document.createElement('div');
                      div.className = 'p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 text-sm';
                      div.innerHTML = `<div class="font-medium text-gray-800">${item.display_name.split(',')[0]}</div><div class="text-xs text-gray-500 truncate mt-0.5">${item.display_name}</div>`;
                      div.onclick = () => {
                        setFormData(prev => ({ ...prev, latitude: item.lat, longitude: item.lon }));
                        dropdown.classList.add('hidden');
                        e.target.value = item.display_name.split(',')[0]; // Set input to the selected short name
                      };
                      dropdown.appendChild(div);
                    });
                  }
                  dropdown.classList.remove('hidden');
                } catch (err) {
                  console.error("Autocomplete search failed", err);
                  loader.classList.add('hidden');
                }
              }, 500); // Wait 500ms after user stops typing before fetching
            }}
          />
          
          {/* Spinner Icon */}
          <div id="location-search-loader" className="hidden absolute right-3 top-2.5">
            <Loader size={18} className="text-gray-400 animate-spin" />
          </div>
          
          {/* Dropdown Results */}
          <div 
            id="location-search-dropdown" 
            className="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
          >
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Powered by OpenStreetMap. Suggestions appear automatically as you type.</p>
      </div>
      {/* -- [END] Location Search Autocomplete -- */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude *
          </label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter latitude"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude *
          </label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter longitude"
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
                    src={`http://localhost:8000/storage/${img.image_path}`}
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
                    src={`${STORAGE_BASE_URL}/${img.image_path}`}
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
          <p>• Maximum 10 images per location</p>
          <p>• Currently using: {totalImages}/10 slots</p>
          <p>• Supported formats: JPEG, JPG, PNG, GIF, WEBP</p>
          <p>• Maximum file size: 2MB per image</p>
          {remainingSlots <= 0 && (
            <p className="text-orange-600 font-medium">Maximum 10 images reached.</p>
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
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of the location"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Long Description *
        </label>
        <textarea
          name="longDescription"
          value={formData.longDescription}
          onChange={handleInputChange}
          required
          rows="4"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Detailed description of the location"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 min-w-[80px]"
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : (location ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default LocationForm;