import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, ChevronDown, ChevronUp, IdCardIcon, MapPin, Languages, Edit3, Trash2, User, Mail, Phone, Calendar, X, Upload, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { getMyGuide, updateMyGuide, deleteMyGuide, getLocations, checkNicAvailability } from '../../../services/api';
import { FaWhatsapp } from 'react-icons/fa6';

const GuideProfile = ({ isExpanded, onToggleExpand, userId }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditGuideForm, setShowEditGuideForm] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [guideFormData, setGuideFormData] = useState({
    guide_name: '',
    guide_nic: '',
    guide_dob: '',
    guide_gender: '',
    guide_address: '',
    business_mail: '',
    contact_number: '',
    whatsapp_number: '',
    short_description: '',
    long_description: '',
    languages: [],
    locations: []
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  const availableLanguages = ['English', 'Sinhala', 'Tamil', 'German', 'French', 'Japanese', 'Chinese'];
  const genderOptions = ['Male', 'Female', 'Other'];

  // NIC Validation State
  const [nicValidation, setNicValidation] = useState({
    loading: false,
    available: null,
    message: ''
  });
  const [nicDebounceTimer, setNicDebounceTimer] = useState(null);

  // Fetch data only when expanded
  useEffect(() => {
    if (isExpanded && userId) {
      fetchGuideData();
      fetchLocations();
    }
  }, [isExpanded, userId]);

  const fetchGuideData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyGuide();
      const guideData = response.data;
      setGuide(guideData);
      
      // Set form data with correct field names
      setGuideFormData({
        guide_name: guideData.guide_name || '',
        guide_nic: guideData.guide_nic || '',
        guide_dob: guideData.guide_dob || '',
        guide_gender: guideData.guide_gender || '',
        guide_address: guideData.guide_address || '',
        business_mail: guideData.business_mail || '',
        contact_number: guideData.contact_number || '',
        whatsapp_number: guideData.whatsapp_number || '',
        short_description: guideData.short_description || '',
        long_description: guideData.long_description || '',
        languages: guideData.languages || [],
        locations: guideData.locations || []
      });

      // Set existing images
      setExistingImages(guideData.images || []);
      setImagesToRemove([]);
      setNewImages([]);

    } catch (err) {
      console.error('Error fetching guide data:', err);
      setError('Failed to load guide data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await getLocations();
      const locationNames = response.data.map(location => location.name || location.locationName);
      setAvailableLocations(locationNames);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Real-time NIC validation with debounce
  const validateNic = useCallback(async (nicValue) => {
    if (!nicValue || nicValue.length < 5) {
      setNicValidation({ loading: false, available: null, message: '' });
      return;
    }

    // Skip validation if it's the same NIC in edit mode
    if (guide && nicValue === guide.guide_nic) {
      setNicValidation({ loading: false, available: true, message: 'Current NIC' });
      return;
    }

    setNicValidation({ loading: true, available: null, message: 'Checking NIC availability...' });
    
    try {
      const response = await checkNicAvailability({
        nic: nicValue,
        role: 'guide',
        current_guide_id: guide?.id // Pass current guide ID for update validation
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
  }, [guide]);

  // Debounced NIC validation
  useEffect(() => {
    const nicValue = guideFormData.guide_nic;
    
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
  }, [guideFormData.guide_nic, validateNic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuideFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (language) => {
    setGuideFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleLocationChange = (location) => {
    setGuideFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const currentImageCount = existingImages.length - imagesToRemove.length;
    const totalAfterAdd = currentImageCount + newImages.length + files.length;
    
    if (totalAfterAdd > 5) {
      alert(`Maximum 5 images allowed. You currently have ${currentImageCount + newImages.length} images.`);
      return;
    }
    
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)
    );
    
    setNewImages(prev => [...prev, ...validImageFiles]);
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setImagesToRemove(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
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

  const handleUpdateGuide = async () => {
    // Final validation before submission
    if (nicValidation.available === false) {
      alert('Please fix the NIC validation error before submitting.');
      return;
    }

    if (nicValidation.loading) {
      alert('Please wait for NIC validation to complete.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Append all guide fields with correct field names
      Object.keys(guideFormData).forEach(key => {
        if (key === 'languages' || key === 'locations') {
          guideFormData[key].forEach(item => {
            formData.append(`${key}[]`, item);
          });
        } else if (guideFormData[key] !== null && guideFormData[key] !== undefined) {
          formData.append(key, guideFormData[key]);
        }
      });

      // Append new images
      newImages.forEach(img => {
        formData.append('guideImage[]', img);
      });

      // Append images to remove
      if (imagesToRemove.length > 0) {
        imagesToRemove.forEach(imageId => {
          formData.append('removedImages[]', imageId);
        });
      }

      // Add method spoofing for PUT
      formData.append('_method', 'PUT');

      const response = await updateMyGuide(formData);
      setGuide(response.data.guide || response.data);
      setShowEditGuideForm(false);
      setNewImages([]);
      setImagesToRemove([]);
      
      // Refresh data
      await fetchGuideData();
      
      alert('Guide details updated successfully!');
    } catch (err) {
      console.error('Error updating guide:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update guide details.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGuide = async () => {
    if (window.confirm('Are you sure you want to delete your guide profile? This action cannot be undone.')) {
      try {
        await deleteMyGuide();
        alert('Guide profile deleted successfully!');
        window.location.reload();
      } catch (err) {
        console.error('Error deleting guide:', err);
        setError('Failed to delete guide profile. Please try again.');
      }
    }
  };

  const cancelEdit = () => {
    setShowEditGuideForm(false);
    setNewImages([]);
    setImagesToRemove([]);
    setNicValidation({ loading: false, available: null, message: '' });
    
    // Reset form data to current guide data
    if (guide) {
      setGuideFormData({
        guide_name: guide.guide_name || '',
        guide_nic: guide.guide_nic || '',
        guide_dob: guide.guide_dob || '',
        guide_gender: guide.guide_gender || '',
        guide_address: guide.guide_address || '',
        business_mail: guide.business_mail || '',
        contact_number: guide.contact_number || '',
        whatsapp_number: guide.whatsapp_number || '',
        short_description: guide.short_description || '',
        long_description: guide.long_description || '',
        languages: guide.languages || [],
        locations: guide.locations || []
      });
      setExistingImages(guide.images || []);
    }
  };

  // Calculate image slots
  const currentImageCount = existingImages.length - imagesToRemove.length;
  const totalImages = currentImageCount + newImages.length;
  const remainingSlots = Math.max(0, 5 - totalImages);

  // Image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-guide.jpg';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
  };

  const removedImages = guide ? guide.images.filter(img => imagesToRemove.includes(img.id)) : [];

  // NIC Validation Indicator Component
  const NicValidationIndicator = () => {
    const nicValue = guideFormData.guide_nic;
    
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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      {/* Header Section - Always Visible */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <Shield className="size-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Guide Profile</h3>
              <p className="text-green-100">Manage your guide services</p>
            </div>
          </div>
          <button
            onClick={onToggleExpand}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="size-6 text-white" />
            ) : (
              <ChevronDown className="size-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Content Section - Only visible when expanded */}
      {isExpanded && (
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <Loader className="size-8 animate-spin mx-auto mb-2 text-green-600" />
              <p>Loading guide data...</p>
            </div>
          ) : guide ? (
            <>
              {/* Guide Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-800">Guide Details</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditGuideForm(!showEditGuideForm)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors text-sm"
                    >
                      <Edit3 className="size-4" />
                      {showEditGuideForm ? 'Cancel Edit' : 'Edit Details'}
                    </button>
                    <button
                      onClick={handleDeleteGuide}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors text-sm"
                    >
                      <Trash2 className="size-4" />
                      Delete Profile
                    </button>
                  </div>
                </div>
                
                {showEditGuideForm ? (
                  <div className="space-y-6">
                    {/* Image Management */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guide Images {remainingSlots >= 0 && `(${remainingSlots} remaining)`}
                      </label>

                      {/* Removed Images */}
                      {removedImages.length > 0 && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800 mb-2 font-medium">
                            {removedImages.length} image{removedImages.length !== 1 ? 's' : ''} marked for removal
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {removedImages.map((img) => (
                              <div key={img.id} className="relative h-32 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center opacity-60">
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
                              <div key={img.id} className="relative h-32 border border-gray-300 rounded-lg flex items-center justify-center group">
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
                              <div key={`new-${index}`} className="relative h-32 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center bg-green-50">
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
                              </div>
                            ))}
                            
                            {remainingSlots > 0 && (
                              <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
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
                        <p>• Supported formats: JPEG, PNG, GIF, WEBP</p>
                        <p>• Maximum file size: 2MB per image</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Guide Name *
                        </label>
                        <input
                          type="text"
                          name="guide_name"
                          value={guideFormData.guide_name}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NIC Number *
                        </label>
                        <input
                          type="text"
                          name="guide_nic"
                          value={guideFormData.guide_nic}
                          onChange={handleInputChange}
                          required
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                            nicValidation.available === false 
                              ? 'border-red-300 focus:ring-red-500' 
                              : nicValidation.available === true
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-green-500'
                          }`}
                        />
                        <NicValidationIndicator />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="guide_dob"
                          value={guideFormData.guide_dob}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender *
                        </label>
                        <select
                          name="guide_gender"
                          value={guideFormData.guide_gender}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          {genderOptions.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        name="guide_address"
                        value={guideFormData.guide_address}
                        onChange={handleInputChange}
                        required
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Email *
                        </label>
                        <input
                          type="email"
                          name="business_mail"
                          value={guideFormData.business_mail}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number *
                        </label>
                        <input
                          type="tel"
                          name="contact_number"
                          value={guideFormData.contact_number}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="whatsapp_number"
                          value={guideFormData.whatsapp_number}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description *
                      </label>
                      <textarea
                        name="short_description"
                        value={guideFormData.short_description}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        maxLength="1000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {guideFormData.short_description.length}/1000 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        name="long_description"
                        value={guideFormData.long_description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        maxLength="10000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {guideFormData.long_description.length}/10000 characters
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
                              checked={guideFormData.languages.includes(language)}
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
                        Service Locations
                      </label>
                      {loadingLocations ? (
                        <div className="text-gray-500">Loading locations...</div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableLocations.map(location => (
                            <label key={location} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={guideFormData.locations.includes(location)}
                                onChange={() => handleLocationChange(location)}
                                className="mr-2"
                              />
                              {location}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleUpdateGuide}
                        disabled={submitting || nicValidation.available === false}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting && <Loader className="size-4 animate-spin" />}
                        {submitting ? 'Updating...' : 'Update Guide'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={submitting}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="space-y-6">
                    {/* Images Display */}
                    {existingImages.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Guide Images
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {existingImages.map((img, index) => (
                            <img
                              key={img.id}
                              src={getImageUrl(img.image_path)}
                              alt={img.alt_text || `Guide image ${index + 1}`}
                              className="h-32 w-full object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.src = "/default-guide.jpg";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <User className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{guide.guide_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <IdCardIcon className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">NIC</p>
                          <p className="font-medium">{guide.guide_nic}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Business Email</p>
                          <p className="font-medium">{guide.business_mail}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Contact Number</p>
                          <p className="font-medium">{guide.contact_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaWhatsapp className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">WhatsApp Number</p>
                          <p className="font-medium">{guide.whatsapp_number || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium">{new Date(guide.guide_dob).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-medium">{guide.guide_gender}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="font-medium">{guide.guide_address}</p>
                    </div>

                    {guide.short_description && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Short Description</p>
                        <p className="font-medium">{guide.short_description}</p>
                      </div>
                    )}

                    {guide.long_description && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Detailed Description</p>
                        <p className="font-medium whitespace-pre-line">{guide.long_description}</p>
                      </div>
                    )}

                    {guide.languages && guide.languages.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          <Languages className="size-4 mr-2" />
                          Languages
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {guide.languages.map((language, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {guide.locations && guide.locations.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          <MapPin className="size-4 mr-2" />
                          Service Locations
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {guide.locations.map((location, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Shield className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No guide profile found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuideProfile;