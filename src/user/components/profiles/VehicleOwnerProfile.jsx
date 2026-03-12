import React, { useState, useEffect } from 'react';
import { Car, ChevronDown, ChevronUp, Plus, Edit3, Trash2, MapPin, User, Mail, Phone, CreditCard, X, Upload, MessageCircle } from 'lucide-react';
import {
  getMyVehicleOwner,
  updateMyVehicleOwner,
  deleteMyVehicleOwner,
  getMyVehicles,
  createMyVehicle,
  updateMyVehicle,
  deleteMyVehicle,
  getLocations,
} from '../../../services/api';

const VehicleOwnerProfile = ({ isExpanded, onToggleExpand, userId }) => {
  const [vehicleOwner, setVehicleOwner] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditOwnerForm, setShowEditOwnerForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const vehicleTypes = ['Car', 'Van', 'SUV', 'Jeep', 'Motorbike', 'Scooty', 'Tuk-tuk', 'Cab', 'Truck', 'Bus', 'Lorry', 'Footcycle'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Petrol Hybrid', 'Diesel Hybrid', 'None'];
  const driverStatus = ['With/Without Driver', 'With Driver', 'Without Driver'];

  const [ownerFormData, setOwnerFormData] = useState({
    vehicleOwnerName: '',
    vehicleOwnerNic: '',
    businessMail: '',
    personalNumber: '',
    whatsappNumber: '',
    description: '',
    locations: []
  });

  const [vehicleFormData, setVehicleFormData] = useState({
    vehicleName: '',
    vehicleType: '',
    vehicleNumber: '',
    pricePerDay: '',
    mileagePerDay: '',
    fuelType: '',
    withDriver: '',
    description: '',
    locations: []
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch data only when expanded
  useEffect(() => {
    if (isExpanded && userId) {
      fetchVehicleOwnerData();
      fetchLocations();
    }
  }, [isExpanded, userId]);

  const fetchVehicleOwnerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ownerResponse = await getMyVehicleOwner();
      setVehicleOwner(ownerResponse.data);
      setOwnerFormData({
        vehicleOwnerName: ownerResponse.data.vehicleOwnerName,
        vehicleOwnerNic: ownerResponse.data.vehicleOwnerNic,
        businessMail: ownerResponse.data.businessMail,
        personalNumber: ownerResponse.data.personalNumber,
        whatsappNumber: ownerResponse.data.whatsappNumber,
        description: ownerResponse.data.description || '',
        locations: ownerResponse.data.locations || []
      });
      
      const vehiclesResponse = await getMyVehicles();
      setVehicles(vehiclesResponse.data);
    } catch (err) {
      console.error('Error fetching vehicle owner data:', err);
      setError('Failed to load vehicle owner data. Please try again.');
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

  const handleUpdateOwner = async () => {
    try {
      const response = await updateMyVehicleOwner(ownerFormData);
      setVehicleOwner(response.data.vehicleOwner);
      setShowEditOwnerForm(false);
      alert('Vehicle owner details updated successfully!');
    } catch (err) {
      console.error('Error updating vehicle owner:', err);
      setError('Failed to update vehicle owner details.');
    }
  };

  const handleDeleteOwner = async () => {
    if (window.confirm('Are you sure you want to delete your vehicle owner profile? This will also remove all associated vehicles.')) {
      try {
        await deleteMyVehicleOwner();
        alert('Vehicle owner deleted successfully!');
        window.location.reload();
      } catch (err) {
        console.error('Error deleting vehicle owner:', err);
        setError('Failed to delete vehicle owner.');
      }
    }
  };

  const handleSaveVehicle = async () => {
    try {
      const formData = new FormData();
      formData.append('vehicleName', vehicleFormData.vehicleName);
      formData.append('vehicleType', vehicleFormData.vehicleType);
      formData.append('vehicleNumber', vehicleFormData.vehicleNumber);
      formData.append('pricePerDay', vehicleFormData.pricePerDay);
      formData.append('mileagePerDay', vehicleFormData.mileagePerDay);
      formData.append('fuelType', vehicleFormData.fuelType);
      formData.append('withDriver', vehicleFormData.withDriver);
      formData.append('description', vehicleFormData.description);
      
      // Only append locations if they exist
      if (vehicleFormData.locations && vehicleFormData.locations.length > 0) {
        vehicleFormData.locations.forEach(loc => {
          formData.append('locations[]', loc);
        });
      }

      // Append images if they exist
      images.forEach(image => {
        if (image instanceof File && image.type.startsWith('image/')) {
          formData.append('vehicleImage[]', image);
        }
      });

      let response;
      if (editingVehicle) {
        response = await updateMyVehicle(editingVehicle.id, formData);
        setVehicles(vehicles.map(vehicle => vehicle.id === editingVehicle.id ? response.data.vehicle : vehicle));
      } else {
        response = await createMyVehicle(formData);
        setVehicles([...vehicles, response.data.vehicle]);
      }
      
      setShowVehicleForm(false);
      setEditingVehicle(null);
      resetVehicleForm();
      alert(editingVehicle ? 'Vehicle updated successfully!' : 'Vehicle created successfully!');
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setError('Failed to save vehicle. Please try again.');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteMyVehicle(vehicleId);
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
        alert('Vehicle deleted successfully!');
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        setError('Failed to delete vehicle.');
      }
    }
  };

  const startEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleFormData({
      vehicleName: vehicle.vehicleName,
      vehicleType: vehicle.vehicleType,
      vehicleNumber: vehicle.vehicleNumber,
      pricePerDay: vehicle.pricePerDay,
      mileagePerDay: vehicle.mileagePerDay,
      fuelType: vehicle.fuelType,
      withDriver: vehicle.withDriver,
      description: vehicle.description || '',
      locations: vehicle.locations || []
    });
    setImagePreviews(vehicle.vehicleImage ? vehicle.vehicleImage.map(img => `http://localhost:8000/storage/${img}`) : []);
    setImages([]);
    setShowVehicleForm(true);
  };

  const resetVehicleForm = () => {
    setVehicleFormData({
      vehicleName: '',
      vehicleType: '',
      vehicleNumber: '',
      pricePerDay: '',
      mileagePerDay: '',
      fuelType: '',
      withDriver: '',
      description: '',
      locations: []
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)
    );
    
    const newImages = [...images, ...validImageFiles];
    setImages(newImages);
    
    const newPreviews = validImageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    if (newPreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleLocationChange = (location, isOwnerForm = false) => {
    if (isOwnerForm) {
      setOwnerFormData(prev => ({
        ...prev,
        locations: prev.locations.includes(location)
          ? prev.locations.filter(l => l !== location)
          : [...prev.locations, location]
      }));
    } else {
      setVehicleFormData(prev => ({
        ...prev,
        locations: prev.locations.includes(location)
          ? prev.locations.filter(l => l !== location)
          : [...prev.locations, location]
      }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      {/* Header Section - Always Visible */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <Car className="size-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Vehicle Owner Dashboard</h3>
              <p className="text-blue-100">Manage your vehicle fleet</p>
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
            <div className="text-center py-8">Loading vehicle owner data...</div>
          ) : vehicleOwner ? (
            <>
              {/* Vehicle Owner Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-800">Vehicle Owner Details</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditOwnerForm(!showEditOwnerForm)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-sm"
                    >
                      <Edit3 className="size-4" />
                      Edit Details
                    </button>
                    <button
                      onClick={handleDeleteOwner}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors text-sm"
                    >
                      <Trash2 className="size-4" />
                      Delete Owner
                    </button>
                  </div>
                </div>
                
                {showEditOwnerForm ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Owner Name
                        </label>
                        <input
                          type="text"
                          value={ownerFormData.vehicleOwnerName}
                          onChange={(e) => setOwnerFormData({...ownerFormData, vehicleOwnerName: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NIC Number
                        </label>
                        <input
                          type="text"
                          value={ownerFormData.vehicleOwnerNic}
                          onChange={(e) => setOwnerFormData({...ownerFormData, vehicleOwnerNic: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Email
                        </label>
                        <input
                          type="email"
                          value={ownerFormData.businessMail}
                          onChange={(e) => setOwnerFormData({...ownerFormData, businessMail: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Personal Number
                        </label>
                        <input
                          type="tel"
                          value={ownerFormData.personalNumber}
                          onChange={(e) => setOwnerFormData({...ownerFormData, personalNumber: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={ownerFormData.whatsappNumber}
                          onChange={(e) => setOwnerFormData({...ownerFormData, whatsappNumber: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={ownerFormData.description}
                        onChange={(e) => setOwnerFormData({...ownerFormData, description: e.target.value})}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operating Locations
                      </label>
                      {loadingLocations ? (
                        <div className="text-gray-500">Loading locations...</div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableLocations.map(location => (
                            <label key={location} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={ownerFormData.locations.includes(location)}
                                onChange={() => handleLocationChange(location, true)}
                                className="mr-2"
                              />
                              {location}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleUpdateOwner}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update Details
                      </button>
                      <button
                        onClick={() => setShowEditOwnerForm(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{vehicleOwner.vehicleOwnerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">NIC</p>
                        <p className="font-medium">{vehicleOwner.vehicleOwnerNic}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Business Email</p>
                        <p className="font-medium">{vehicleOwner.businessMail}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Personal Number</p>
                        <p className="font-medium">{vehicleOwner.personalNumber}</p>
                      </div>
                    </div>
                    {vehicleOwner.whatsappNumber && (
                      <div className="flex items-center">
                        <MessageCircle className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">WhatsApp Number</p>
                          <p className="font-medium">{vehicleOwner.whatsappNumber}</p>
                        </div>
                      </div>
                    )}
                    {vehicleOwner.description && (
                      <div className="col-span-full">
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="font-medium">{vehicleOwner.description}</p>
                      </div>
                    )}
                    {vehicleOwner.locations && vehicleOwner.locations.length > 0 && (
                      <div className="col-span-full">
                        <p className="text-sm text-gray-600">Operating Locations</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {vehicleOwner.locations.map((location, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vehicle Form */}
              {showVehicleForm && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-lg font-semibold mb-4">
                    {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Name *
                      </label>
                      <input
                        type="text"
                        value={vehicleFormData.vehicleName}
                        onChange={(e) => setVehicleFormData({...vehicleFormData, vehicleName: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Type *
                        </label>
                        <select
                          value={vehicleFormData.vehicleType}
                          onChange={(e) => setVehicleFormData({...vehicleFormData, vehicleType: e.target.value})}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Vehicle Type</option>
                          {vehicleTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Number *
                        </label>
                        <input
                          type="text"
                          value={vehicleFormData.vehicleNumber}
                          onChange={(e) => setVehicleFormData({...vehicleFormData, vehicleNumber: e.target.value})}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Per Day (LKR) *
                        </label>
                        <input
                          type="text"
                          value={vehicleFormData.pricePerDay}
                          onChange={(e) => setVehicleFormData({...vehicleFormData, pricePerDay: e.target.value})}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mileage Per Day (km) *
                        </label>
                        <input
                          type="text"
                          value={vehicleFormData.mileagePerDay}
                          onChange={(e) => setVehicleFormData({...vehicleFormData, mileagePerDay: e.target.value})}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fuel Type *
                        </label>
                        <select
                          value={vehicleFormData.fuelType}
                          onChange={(e) => setVehicleFormData({...vehicleFormData, fuelType: e.target.value})}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Fuel Type</option>
                          {fuelTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driver Option *
                        </label>
                        <select
                          value={vehicleFormData.withDriver}
                          onChange={(e) => setVehicleFormData({...vehicleFormData, withDriver: e.target.value})}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Driver Option</option>
                          {driverStatus.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Images
                      </label>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative h-32 w-32">
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                              <X className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        <label 
                          htmlFor="fileInput"
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-40"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          <span className="text-sm">Upload Images</span>
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={vehicleFormData.description}
                        onChange={(e) => setVehicleFormData({...vehicleFormData, description: e.target.value})}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operating Locations
                      </label>
                      {loadingLocations ? (
                        <div className="text-gray-500">Loading locations...</div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableLocations.map(location => (
                            <label key={location} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={vehicleFormData.locations.includes(location)}
                                onChange={() => handleLocationChange(location)}
                                className="mr-2"
                              />
                              {location}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSaveVehicle}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                      </button>
                      <button
                        onClick={() => {
                          setShowVehicleForm(false);
                          setEditingVehicle(null);
                          resetVehicleForm();
                        }}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Section */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-gray-800">My Vehicles ({vehicles.length})</h4>
                <button
                  onClick={() => setShowVehicleForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="size-5" />
                  Add Vehicle
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Car className="size-12 mx-auto mb-4 text-gray-400" />
                  <p>No vehicles found. Add your first vehicle to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {vehicle.vehicleImage && vehicle.vehicleImage.length > 0 ? (
                        <img
                          src={`http://localhost:8000/storage/${vehicle.vehicleImage[0]}`}
                          alt={vehicle.vehicleName}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <Car className="size-12 text-gray-400" />
                        </div>
                      )}
                      <div className="p-4">
                        <h5 className="font-semibold text-lg text-gray-800 mb-2">{vehicle.vehicleName}</h5>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Car className="size-4 mr-1" />
                          <span className="text-sm">{vehicle.vehicleType} - {vehicle.vehicleNumber}</span>
                        </div>
                        
                        {/* Vehicle details */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Price/Day:</span>
                            <span className="font-medium">LKR {vehicle.pricePerDay}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Mileage/Day:</span>
                            <span className="font-medium">{vehicle.mileagePerDay} km</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Fuel Type:</span>
                            <span className="font-medium">{vehicle.fuelType}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Driver:</span>
                            <span className="font-medium">{vehicle.withDriver}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vehicle.description}</p>
                        {vehicle.locations && vehicle.locations.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500">Operating Locations:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {vehicle.locations.map((location, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {location}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditVehicle(vehicle)}
                            className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 text-sm transition-colors"
                          >
                            <Edit3 className="size-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 text-sm transition-colors"
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Car className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No vehicle owner data available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleOwnerProfile;