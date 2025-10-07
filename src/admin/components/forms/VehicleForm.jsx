import React, { useState, useEffect, useCallback } from 'react';
import { Upload, X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { getLocations, checkRegistrationNumberAvailability } from '../../../services/api';

const VehicleForm = ({ vehicle, onSave, onCancel, selectedOwner, submitting = false }) => {
  const [formData, setFormData] = useState({
    vehicle_name: vehicle?.vehicle_name || '',
    vehicle_type: vehicle?.vehicle_type || '',
    reg_number: vehicle?.reg_number || '',
    manufactured_year: vehicle?.manufactured_year || '',
    no_of_passengers: vehicle?.no_of_passengers || 1,
    fuel_type: vehicle?.fuel_type || '',
    driver_status: vehicle?.driver_status || '',
    short_description: vehicle?.short_description || '',
    long_description: vehicle?.long_description || '',
    price_per_day: vehicle?.price_per_day ?? null,
    mileage_per_day: vehicle?.mileage_per_day ?? null,
    locations: vehicle?.locations || [],
    user_id: vehicle?.user_id || selectedOwner?.user_id || '',
    vehicle_owner_id: vehicle?.vehicle_owner_id || selectedOwner?.id || '',
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(vehicle?.images || []);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const vehicleTypes = ['Car', 'Van', 'SUV', 'Jeep', 'Motorbike', 'Scooty', 'Tuk-tuk', 'Cab', 'Truck', 'Bus', 'Lorry', 'Footcycle'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Petrol Hybrid', 'Diesel Hybrid', 'None'];
  const driverStatus = ['With/Without Driver', 'With Driver', 'Without Driver'];

  // Registration number validation state
  const [regNumberValidation, setRegNumberValidation] = useState({
    loading: false,
    available: null,
    message: ''
  });
  const [regNumberDebounceTimer, setRegNumberDebounceTimer] = useState(null);

  // Year options (from 1950 to current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

  // Passenger options (1 to 100, common vehicle capacities highlighted)
  const passengerOptions = Array.from({ length: 100 }, (_, i) => i + 1);
  // Common passenger counts for quick selection
  const commonPassengerCounts = [1, 2, 4, 5, 7, 8, 15, 30, 50, 100];

  // Add useEffect to ensure user_id is set
  useEffect(() => {
    if (selectedOwner && !vehicle) {
      setFormData(prev => ({
        ...prev,
        user_id: selectedOwner.user_id,
        vehicle_owner_id: selectedOwner.id
      }));
    }
  }, [selectedOwner, vehicle]);

  useEffect(() => {
    if (vehicle) {
      setExistingImages(vehicle.images || []);
      setImagesToRemove([]);
      setNewImages([]);
    }
  }, [vehicle]);

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

  // Real-time registration number validation with debounce
  const validateRegistrationNumber = useCallback(async (regNumber) => {
    if (!regNumber || regNumber.length < 2) {
      setRegNumberValidation({ loading: false, available: null, message: '' });
      return;
    }

    // Skip validation if it's the same reg number in edit mode
    if (vehicle && regNumber === vehicle.reg_number) {
      setRegNumberValidation({ loading: false, available: true, message: 'Current registration number' });
      return;
    }

    setRegNumberValidation({ loading: true, available: null, message: 'Checking registration number...' });
    
    try {
      const response = await checkRegistrationNumberAvailability({
        reg_number: regNumber,
        exclude_id: vehicle?.id
      });
      
      setRegNumberValidation({
        loading: false,
        available: response.data.available,
        message: response.data.message
      });
    } catch (error) {
      setRegNumberValidation({
        loading: false,
        available: false,
        message: error.response?.data?.message || 'Error validating registration number'
      });
    }
  }, [vehicle]);

  // Debounced registration number validation
  useEffect(() => {
    const regNumber = formData.reg_number;
    
    if (regNumberDebounceTimer) {
      clearTimeout(regNumberDebounceTimer);
    }

    if (regNumber && regNumber.length >= 2) {
      const timer = setTimeout(() => {
        validateRegistrationNumber(regNumber);
      }, 800);
      
      setRegNumberDebounceTimer(timer);
    } else {
      setRegNumberValidation({ loading: false, available: null, message: '' });
    }

    return () => {
      if (regNumberDebounceTimer) {
        clearTimeout(regNumberDebounceTimer);
      }
    };
  }, [formData.reg_number, validateRegistrationNumber]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Auto-format registration number to uppercase as user types
    if (name === 'reg_number') {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' && value === '' ? null : value
      }));
    }
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
    if (vehicle) {
      const originalImage = vehicle.images.find(img => img.id === imageId);
      if (originalImage) {
        setExistingImages(prev => [...prev, originalImage]);
      }
    }
  };

  // Registration Number Validation Indicator Component
  const RegNumberValidationIndicator = () => {
    const regNumber = formData.reg_number;
    
    if (!regNumber || regNumber.length < 2) {
      return (
        <p className="text-xs text-gray-500 mt-1">
          Enter vehicle registration number
        </p>
      );
    }

    if (regNumberValidation.loading) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <Loader className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-xs text-blue-600">{regNumberValidation.message}</span>
        </div>
      );
    }

    if (regNumberValidation.available === false) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-600">{regNumberValidation.message}</span>
        </div>
      );
    }

    if (regNumberValidation.available === true) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600">{regNumberValidation.message}</span>
        </div>
      );
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    if (regNumberValidation.available === false) {
      alert('Please fix the registration number validation error before submitting.');
      return;
    }

    if (regNumberValidation.loading) {
      alert('Please wait for registration number validation to complete.');
      return;
    }

    setLoading(true);

    const formDataObj = new FormData();
    formDataObj.append('vehicle_name', formData.vehicle_name);
    formDataObj.append('vehicle_type', formData.vehicle_type);
    formDataObj.append('reg_number', formData.reg_number);
    if (formData.manufactured_year) {
      formDataObj.append('manufactured_year', formData.manufactured_year);
    }
    formDataObj.append('no_of_passengers', formData.no_of_passengers);
    formDataObj.append('fuel_type', formData.fuel_type);
    formDataObj.append('driver_status', formData.driver_status);
    formDataObj.append('short_description', formData.short_description);
    if (formData.long_description) {
      formDataObj.append('long_description', formData.long_description);
    }
    if (formData.price_per_day !== null && formData.price_per_day !== '') {
      formDataObj.append('price_per_day', Number(formData.price_per_day).toFixed(2));
    } else {
      formDataObj.append('price_per_day', ''); // Send empty string to be converted to null
    }
    if (formData.mileage_per_day !== null && formData.mileage_per_day !== '') {
      formDataObj.append('mileage_per_day', formData.mileage_per_day);
    } else {
      formDataObj.append('mileage_per_day', ''); // Send empty string to be converted to null
    }
    formDataObj.append('user_id', formData.user_id);
    formDataObj.append('vehicle_owner_id', formData.vehicle_owner_id);

    // Location handling
    if (formData.locations && formData.locations.length > 0) {
      formData.locations.forEach(locationName => {
        formDataObj.append('locations[]', locationName);
      });
    }

    // Append each new image file
    newImages.forEach(img => {
      formDataObj.append('vehicleImage[]', img);
    });

    // Append images to remove (for edit mode)
    if (vehicle && imagesToRemove.length > 0) {
      imagesToRemove.forEach(imageId => {
        formDataObj.append('removedImages[]', imageId);
      });
    }

    // Add method spoofing for PUT
    if (vehicle) {
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

  const removedImages = vehicle ? vehicle.images.filter(img => imagesToRemove.includes(img.id)) : [];

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
            Make & Model *
          </label>
          <input
            type="text"
            name="vehicle_name"
            value={formData.vehicle_name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter vehicle's make & model"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type *
          </label>
          <select
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reg No *
          </label>
          <input
            type="text"
            name="reg_number"
            value={formData.reg_number}
            onChange={handleInputChange}
            required
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              regNumberValidation.available === false 
                ? 'border-red-300 focus:ring-red-500' 
                : regNumberValidation.available === true
                ? 'border-green-300 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter vehicle registration number"
          />
          <RegNumberValidationIndicator />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manufactured Year
          </label>
          <select
            name="manufactured_year"
            value={formData.manufactured_year || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Year (Optional)</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select the year the vehicle was manufactured
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Passengers *
          </label>
          <select
            name="no_of_passengers"
            value={formData.no_of_passengers}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Passenger Capacity</option>
            {commonPassengerCounts.map(count => (
              <option key={count} value={count}>
                {count} {count === 1 ? 'passenger' : 'passengers'}
              </option>
            ))}
            <option disabled>--- Other ---</option>
            {passengerOptions
              .filter(count => !commonPassengerCounts.includes(count))
              .map(count => (
                <option key={count} value={count}>
                  {count} passengers
                </option>
              ))
            }
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Common capacities shown first for quick selection
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type *
          </label>
          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Fuel Type</option>
            {fuelTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Driver Status *
        </label>
        <select
          name="driver_status"
          value={formData.driver_status}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Driver Status</option>
          {driverStatus.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
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
          <p>• Maximum 5 images per vehicle</p>
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
          placeholder="Brief description of the vehicle"
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
          placeholder="Detailed description of the vehicle (optional)"
          maxLength="10000"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.long_description?.length || 0}/10000 characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Per Day (LKR.)
          </label>
          <input
            type="number"
            name="price_per_day"
            value={formData.price_per_day ?? ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter price per day (optional)"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage Per Day (km)
          </label>
          <input
            type="number"
            name="mileage_per_day"
            value={formData.mileage_per_day ?? ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter allowed distance per day in km (optional)"
            min="0"
            step="1"
          />
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
          {submitting ? <Loader className="w-5 h-5 animate-spin" /> : (vehicle ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;