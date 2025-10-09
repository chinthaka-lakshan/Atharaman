import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, User, Mail, Phone, FileText, MapPin, Languages, 
  Image, MessageCircle, Check, Calendar, Map, AlertCircle, CheckCircle
} from 'lucide-react';
import { getLocations, checkNicAvailability } from '../../services/api';

const RoleRequestForm = ({ role, userData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    // Common fields
    name: userData.name,
    email: userData.email,
    // Role-specific fields with new structure
    guide_name: '',
    guide_nic: '',
    guide_dob: '',
    guide_gender: '',
    guide_address: '',
    shop_owner_name: '',
    shop_owner_nic: '',
    shop_owner_dob: '',
    shop_owner_address: '',
    hotel_owner_name: '',
    hotel_owner_nic: '',
    hotel_owner_dob: '',
    hotel_owner_address: '',
    vehicle_owner_name: '',
    vehicle_owner_nic: '',
    vehicle_owner_dob: '',
    vehicle_owner_address: '',
    // Contact fields
    business_mail: userData.email,
    contact_number: '',
    whatsapp_number: '',
    // Guide-specific fields
    short_description: '',
    long_description: '',
    languages: ['English'],
    locations: [],
    guide_images: []
  });

  const [availableLocations, setAvailableLocations] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const availableLanguages = ['English', 'Sinhala', 'Tamil', 'German', 'French', 'Japanese', 'Chinese'];
  const genderOptions = ['Male', 'Female', 'Other'];

  // NIC validation state
  const [nicValidation, setNicValidation] = useState({
    loading: false,
    available: null,
    message: ''
  });

  const [nicDebounceTimer, setNicDebounceTimer] = useState(null);

  useEffect(() => {
    if (role === 'guide' || role === 'vehicle_owner') {
      fetchLocations();
    }
  }, [role]);

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

  // Get the current NIC field name based on role
  const getNicFieldName = () => {
    switch (role) {
      case 'guide': return 'guide_nic';
      case 'shop_owner': return 'shop_owner_nic';
      case 'hotel_owner': return 'hotel_owner_nic';
      case 'vehicle_owner': return 'vehicle_owner_nic';
      default: return '';
    }
  };

  // Get the current NIC value
  const getCurrentNic = () => {
    const nicField = getNicFieldName();
    return formData[nicField] || '';
  };

  // Real-time NIC validation with debounce
  const validateNic = useCallback(async (nicValue) => {
    if (!nicValue || nicValue.length < 5) {
      setNicValidation({ loading: false, available: null, message: '' });
      return;
    }

    setNicValidation({ loading: true, available: null, message: 'Checking NIC availability...' });
    
    try {
      const response = await checkNicAvailability({
        nic: nicValue,
        role: role
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
  }, [role]);

  // Debounced NIC validation
  useEffect(() => {
    const nicValue = getCurrentNic();
    
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
  }, [getCurrentNic(), validateNic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Check if adding these files would exceed the 5 image limit
    const currentImageCount = formData.guide_images.length;
    if (currentImageCount + files.length > 5) {
      alert(`Maximum 5 images allowed. You currently have ${currentImageCount} images.`);
      return;
    }

    // Convert images to base64 for storage
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        // Client-side validation
        if (file.size > 2 * 1024 * 1024) {
          alert(`Image "${file.name}" is too large. Maximum size is 2MB.`);
          return resolve(null);
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          alert(`Image "${file.name}" has an invalid format. Please use JPEG, PNG, GIF, or WEBP.`);
          return resolve(null);
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(base64Images => {
      // Filter out any null values from failed validations
      const validImages = base64Images.filter(img => img !== null);
      
      if (validImages.length > 0) {
        setFormData(prev => ({
          ...prev,
          guide_images: [...prev.guide_images, ...validImages]
        }));
      }
    });
    
    // Reset the file input to allow selecting the same files again
    e.target.value = '';
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      guide_images: prev.guide_images.filter((_, i) => i !== index)
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

  const handleSubmit = (e) => {
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
  
    onSubmit(formData);
  };

  // NIC Validation Indicator Component
  const NicValidationIndicator = () => {
    const nicValue = getCurrentNic();
    
    if (!nicValue || nicValue.length < 5) {
      return (
        <p className="text-xs text-gray-500 mt-1">
          Enter your NIC number to check availability
        </p>
      );
    }

    if (nicValidation.loading) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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

  // Update the NIC input field in each form renderer
  const renderNicField = () => {
    const nicField = getNicFieldName();
    const placeholder = role === 'guide' ? '199012345678V' : '199012345678V';
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number *</label>
        <input
          type="text"
          name={nicField}
          value={formData[nicField]}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            nicValidation.available === false 
              ? 'border-red-300 focus:ring-red-500' 
              : nicValidation.available === true
              ? 'border-green-300 focus:ring-green-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          required
          placeholder={placeholder}
        />
        <NicValidationIndicator />
      </div>
    );
  };

  // Languages Checkbox Component
  const LanguagesCheckbox = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Languages className="inline w-4 h-4 mr-1" />
        Languages
      </label>
      <div className="grid grid-cols-2 gap-2">
        {availableLanguages.map(language => (
          <label key={language} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.languages.includes(language)}
              onChange={() => handleLanguageChange(language)}
              className="rounded"
            />
            <span>{language}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // Locations Checkbox Component
  const LocationsCheckbox = () => {
    if (locationLoading) {
      return <div className="text-gray-500 text-sm">Loading locations...</div>;
    }
    
    if (locationError) {
      return <div className="text-red-500 text-sm">{locationError}</div>;
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Locations
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {availableLocations.map(location => (
            <label key={location.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.locations.includes(location.locationName)}
                onChange={() => handleLocationChange(location.locationName)}
                className="rounded"
              />
              <span>{location.locationName}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderGuideForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Image className="inline w-4 h-4 mr-1" />
          Guide Images ({formData.guide_images.length}/5)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          multiple
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload your profile pictures (optional, max 5 images, 2MB each, JPEG, PNG, GIF, WEBP)
        </p>
        
        {/* Show selected image previews */}
        {formData.guide_images.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Selected images (click × to remove):</p>
            <div className="flex flex-wrap gap-2">
              {formData.guide_images.map((imageData, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageData}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-0.5">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {5 - formData.guide_images.length} slots remaining
            </p>
          </div>
        )}

        {/* Show message when no images are selected */}
        {formData.guide_images.length === 0 && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              No images selected. You can add up to 5 images, but they are optional.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline w-4 h-4 mr-1" />
            Guide Name *
          </label>
          <input
            type="text"
            name="guide_name"
            value={formData.guide_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your full name"
          />
        </div>
        {renderNicField()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            Date of Birth *
          </label>
          <input
            type="date"
            name="guide_dob"
            value={formData.guide_dob}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select
            name="guide_gender"
            value={formData.guide_gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            {genderOptions.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="inline w-4 h-4 mr-1" />
            Contact Number *
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="+94771234567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Map className="inline w-4 h-4 mr-1" />
          Address *
        </label>
        <textarea
          name="guide_address"
          value={formData.guide_address}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Enter your complete address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="inline w-4 h-4 mr-1" />
            Business Email *
          </label>
          <input
            type="email"
            name="business_mail"
            value={formData.business_mail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MessageCircle className="inline w-4 h-4 mr-1" />
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+94771234567"
          />
        </div>
      </div>

      <LanguagesCheckbox />
      <LocationsCheckbox />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
        <textarea
          name="short_description"
          value={formData.short_description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Brief description of your experience and expertise as a guide..."
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1">{formData.short_description.length}/1000 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
        <textarea
          name="long_description"
          value={formData.long_description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detailed description of your services, experience, specialties..."
          maxLength={10000}
        />
        <p className="text-xs text-gray-500 mt-1">{formData.long_description.length}/10000 characters</p>
      </div>
    </>
  );

  const renderBusinessOwnerForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline w-4 h-4 mr-1" />
            {role === 'shop_owner' ? 'Shop Owner Name *' : 'Hotel Owner Name *'}
          </label>
          <input
            type="text"
            name={role === 'shop_owner' ? 'shop_owner_name' : 'hotel_owner_name'}
            value={role === 'shop_owner' ? formData.shop_owner_name : formData.hotel_owner_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {renderNicField()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            Date of Birth *
          </label>
          <input
            type="date"
            name={role === 'shop_owner' ? 'shop_owner_dob' : 'hotel_owner_dob'}
            value={role === 'shop_owner' ? formData.shop_owner_dob : formData.hotel_owner_dob}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="inline w-4 h-4 mr-1" />
            Contact Number *
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="+94771234567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Map className="inline w-4 h-4 mr-1" />
          Address *
        </label>
        <textarea
          name={role === 'shop_owner' ? 'shop_owner_address' : 'hotel_owner_address'}
          value={role === 'shop_owner' ? formData.shop_owner_address : formData.hotel_owner_address}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Enter your complete address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="inline w-4 h-4 mr-1" />
            Business Email *
          </label>
          <input
            type="email"
            name="business_mail"
            value={formData.business_mail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MessageCircle className="inline w-4 h-4 mr-1" />
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+94771234567"
          />
        </div>
      </div>
    </>
  );

  const renderVehicleOwnerForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline w-4 h-4 mr-1" />
            Vehicle Owner Name *
          </label>
          <input
            type="text"
            name="vehicle_owner_name"
            value={formData.vehicle_owner_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {renderNicField()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            Date of Birth *
          </label>
          <input
            type="date"
            name="vehicle_owner_dob"
            value={formData.vehicle_owner_dob}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="inline w-4 h-4 mr-1" />
            Contact Number *
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="+94771234567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Map className="inline w-4 h-4 mr-1" />
          Address *
        </label>
        <textarea
          name="vehicle_owner_address"
          value={formData.vehicle_owner_address}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Enter your complete address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="inline w-4 h-4 mr-1" />
            Business Email *
          </label>
          <input
            type="email"
            name="business_mail"
            value={formData.business_mail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MessageCircle className="inline w-4 h-4 mr-1" />
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+94771234567"
          />
        </div>
      </div>

      <LocationsCheckbox />
    </>
  );

  const getRoleTitle = () => {
    switch (role) {
      case 'guide': return 'Guide Registration';
      case 'shop_owner': return 'Shop Owner Registration';
      case 'hotel_owner': return 'Hotel Owner Registration';
      case 'vehicle_owner': return 'Vehicle Owner Registration';
      default: return 'Role Registration';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{getRoleTitle()}</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {role === 'guide' && renderGuideForm()}
          {(role === 'hotel_owner' || role === 'shop_owner') && renderBusinessOwnerForm()}
          {role === 'vehicle_owner' && renderVehicleOwnerForm()}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleRequestForm;