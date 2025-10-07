import React, { useState, useEffect, useCallback } from 'react';
import { Upload, X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { getUsers, getLocations, checkNicAvailability } from '../../../services/api';

const GuideForm = ({ guide, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    guide_name: guide?.guide_name || '',
    guide_nic: guide?.guide_nic || '',
    guide_dob: guide?.guide_dob || '',
    guide_gender: guide?.guide_gender || '',
    guide_address: guide?.guide_address || '',
    business_mail: guide?.business_mail || '',
    contact_number: guide?.contact_number || '',
    whatsapp_number: guide?.whatsapp_number || '',
    short_description: guide?.short_description || '',
    long_description: guide?.long_description || '',
    languages: guide?.languages || [],
    locations: guide?.locations || [],
    user_id: guide?.user_id || ''
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(guide?.images || []);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');

  const availableLanguages = ['English', 'Sinhala', 'Tamil', 'German', 'French', 'Japanese', 'Chinese'];
  const genderOptions = ['Male', 'Female', 'Other'];

  const [nicValidation, setNicValidation] = useState({
    loading: false,
    available: null,
    message: ''
  });
  const [nicDebounceTimer, setNicDebounceTimer] = useState(null);

  useEffect(() => {
    if (guide) {
      setExistingImages(guide.images || []);
      setImagesToRemove([]);
      setNewImages([]);
    }
  }, [guide]);

  useEffect(() => {
    if (!isEditing) {
      fetchUsers();
    }
    fetchLocations();
  }, [isEditing]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getUsers();

      if (Array.isArray(response.data)) {
        setAvailableUsers(response.data);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setError('Unexpected data format from server');
        setAvailableUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      setAvailableUsers([]);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocationError('Failed to load locations. Please try again.');
      setAvailableLocations([]);
    } finally {
      setLocationLoading(false);
    }
  };

  // Real-time NIC validation with debounce
  const validateNic = useCallback(async (nicValue) => {
    if (!nicValue || nicValue.length < 5) {
      setNicValidation({ loading: false, available: null, message: '' });
      return;
    }

    // Skip validation if it's the same NIC in edit mode
    if (isEditing && guide && nicValue === guide.guide_nic) {
      setNicValidation({ loading: false, available: true, message: 'Current NIC' });
      return;
    }

    setNicValidation({ loading: true, available: null, message: 'Checking NIC availability...' });
    
    try {
      const response = await checkNicAvailability({
        nic: nicValue,
        role: 'guide'
      });
      
      setNicValidation({
        loading: false,
        available: response.data.available,
        message: response.data.message
      });
    } catch (error) {
      setNicValidation({
        loading: false,
        available: false,
        message: error.response?.data?.message || 'Error validating NIC'
      });
    }
  }, [isEditing, guide]);

  // Debounced NIC validation
  useEffect(() => {
    const nicValue = formData.guide_nic;
    
    if (nicDebounceTimer) {
      clearTimeout(nicDebounceTimer);
    }

    if (nicValue && nicValue.length >= 5) {
      const timer = setTimeout(() => {
        validateNic(nicValue);
      }, 800);
      
      setNicDebounceTimer(timer);
    } else {
      setNicValidation({ loading: false, available: null, message: '' });
    }

    return () => {
      if (nicDebounceTimer) {
        clearTimeout(nicDebounceTimer);
      }
    };
  }, [formData.guide_nic, validateNic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
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

    const currentImageCount = existingImages.length - imagesToRemove.length;
    const totalAfterAdd = currentImageCount + newImages.length + files.length;
    
    if (totalAfterAdd > 5) {
      alert(`Maximum 5 images allowed. You currently have ${currentImageCount + newImages.length} images.`);
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
    if (guide) {
      const originalImage = guide.images.find(img => img.id === imageId);
      if (originalImage) {
        setExistingImages(prev => [...prev, originalImage]);
      }
    }
  };

  // NIC Validation Indicator Component
  const NicValidationIndicator = () => {
    const nicValue = formData.guide_nic;
    
    if (!nicValue || nicValue.length < 5) {
      return (
        <p className="text-xs text-gray-500 mt-1">
          Enter NIC number to check availability
        </p>
      );
    }

    if (nicValidation.loading) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <Loader className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-xs text-blue-600">{nicValidation.message}</span>
        </div>
      );
    }

    if (nicValidation.available === false) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-600">{nicValidation.message}</span>
        </div>
      );
    }

    if (nicValidation.available === true) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600">{nicValidation.message}</span>
        </div>
      );
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    if (nicValidation.available === false) {
      alert('Please fix the NIC validation error before submitting.');
      return;
    }

    if (nicValidation.loading) {
      alert('Please wait for NIC validation to complete.');
      return;
    }

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
    
    // Append all guide fields
    formDataObj.append('guide_name', formData.guide_name);
    formDataObj.append('guide_nic', formData.guide_nic);
    formDataObj.append('guide_dob', formData.guide_dob);
    formDataObj.append('guide_gender', formData.guide_gender);
    formDataObj.append('guide_address', formData.guide_address);
    formDataObj.append('business_mail', formData.business_mail);
    formDataObj.append('contact_number', formData.contact_number);
    formDataObj.append('whatsapp_number', formData.whatsapp_number);
    formDataObj.append('short_description', formData.short_description);
    formDataObj.append('long_description', formData.long_description || '');
    
    if (!isEditing) {
      formDataObj.append('user_id', formData.user_id);
    }

    // Append arrays
    formData.languages.forEach(lang => {
      formDataObj.append('languages[]', lang);
    });
    
    if (formData.locations && formData.locations.length > 0) {
      formData.locations.forEach(locationName => {
        formDataObj.append('locations[]', locationName);
      });
    }
    
    // Append images
    newImages.forEach(img => {
      formDataObj.append('guideImage[]', img);
    });

    // Append images to remove (for edit mode)
    if (guide && imagesToRemove.length > 0) {
      imagesToRemove.forEach(imageId => {
        formDataObj.append('removedImages[]', imageId);
      });
    }

    // Add method spoofing for PUT
    if (guide) {
      formDataObj.append('_method', 'PUT');
    }

    try {
      await onSave(formDataObj);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Error saving guide: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining image slots
  const currentImageCount = existingImages.length - imagesToRemove.length;
  const totalImages = currentImageCount + newImages.length;
  const remainingSlots = Math.max(0, 5 - totalImages);

  const removedImages = guide ? guide.images.filter(img => imagesToRemove.includes(img.id)) : [];

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
            Guide Name *
          </label>
          <input
            type="text"
            name="guide_name"
            value={formData.guide_name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter guide name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NIC *
          </label>
          <input
            type="text"
            name="guide_nic"
            value={formData.guide_nic}
            onChange={handleInputChange}
            required
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              nicValidation.available === false 
                ? 'border-red-300 focus:ring-red-500' 
                : nicValidation.available === true
                ? 'border-green-300 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter guide NIC"
          />
          <NicValidationIndicator />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            name="guide_dob"
            value={formData.guide_dob}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            name="guide_gender"
            value={formData.guide_gender}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Gender</option>
            {genderOptions.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <textarea
          name="guide_address"
          value={formData.guide_address}
          onChange={handleInputChange}
          required
          rows="1"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter guide address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Email *
        </label>
        <input
          type="email"
          name="business_mail"
          value={formData.business_mail}
          onChange={handleInputChange}
          required
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
            placeholder="Enter whatsapp number (optional)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User ID {isEditing ? '(Cannot be changed)' : '*'}
        </label>
        {isEditing ? (
          <input
            type="text"
            value={formData.user_id}
            readOnly
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        ) : (
          <>
            {loading ? (
              <div className="flex items-center text-gray-500 text-sm">
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Loading users...
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select User</option>
                {Array.isArray(availableUsers) && availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} (ID: {user.id})
                  </option>
                ))}
              </select>
            )}
          </>
        )}
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
          <p>• Maximum 5 images per guide</p>
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
          required
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of the guide (max 1000 characters)"
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
          placeholder="Detailed description of the guide (optional)"
          maxLength="10000"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.long_description?.length || 0}/10000 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableLanguages.map(language => (
            <label key={language} className="flex items-center">
              <input
                type="checkbox"
                checked={(formData.languages || []).includes(language)}
                onChange={() => handleLanguageChange(language)}
                className="mr-2"
              />
              {language}
            </label>
          ))}
        </div>
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
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : (guide ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default GuideForm;