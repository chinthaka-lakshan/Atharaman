import React, { useState, useEffect } from 'react';
import { Building, ChevronDown, ChevronUp, Plus, Edit3, Trash2, MapPin, User, Mail, Phone, CreditCard, X, Upload, MessageCircle } from 'lucide-react';
import {
  getMyHotelOwner,
  updateMyHotelOwner,
  deleteMyHotelOwner,
  getMyHotels,
  createMyHotel,
  updateMyHotel,
  deleteMyHotel,
  getLocations,
} from '../../../services/api';

const HotelOwnerProfile = ({ isExpanded, onToggleExpand, userId }) => {
  const [hotelOwner, setHotelOwner] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditOwnerForm, setShowEditOwnerForm] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [ownerFormData, setOwnerFormData] = useState({
    hotelOwnerName: '',
    hotelOwnerNic: '',
    businessMail: '',
    contactNumber: ''
  });

  const [hotelFormData, setHotelFormData] = useState({
    hotelName: '',
    hotelAddress: '',
    businessMail: '',
    contactNumber: '',
    whatsappNumber: '',
    description: '',
    locations: []
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch data only when expanded
  useEffect(() => {
    if (isExpanded && userId) {
      fetchHotelOwnerData();
      fetchLocations();
    }
  }, [isExpanded, userId]);

  const fetchHotelOwnerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ownerResponse = await getMyHotelOwner();
      setHotelOwner(ownerResponse.data);
      setOwnerFormData({
        hotelOwnerName: ownerResponse.data.hotelOwnerName,
        hotelOwnerNic: ownerResponse.data.hotelOwnerNic,
        businessMail: ownerResponse.data.businessMail,
        contactNumber: ownerResponse.data.contactNumber
      });
      
      const hotelsResponse = await getMyHotels();
      setHotels(hotelsResponse.data);
    } catch (err) {
      console.error('Error fetching hotel owner data:', err);
      setError('Failed to load hotel owner data. Please try again.');
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
      const response = await updateMyHotelOwner(ownerFormData);
      setHotelOwner(response.data.hotelOwner);
      setShowEditOwnerForm(false);
      alert('Hotel owner details updated successfully!');
    } catch (err) {
      console.error('Error updating hotel owner:', err);
      setError('Failed to update hotel owner details.');
    }
  };

  const handleDeleteOwner = async () => {
    if (window.confirm('Are you sure you want to delete your hotel owner profile? This will also remove all associated hotels.')) {
      try {
        await deleteMyHotelOwner();
        alert('Hotel owner deleted successfully!');
        window.location.reload();
      } catch (err) {
        console.error('Error deleting hotel owner:', err);
        setError('Failed to delete hotel owner.');
      }
    }
  };

  const handleSaveHotel = async () => {
    try {
      const formData = new FormData();
      formData.append('hotelName', hotelFormData.hotelName);
      formData.append('hotelAddress', hotelFormData.hotelAddress);
      formData.append('businessMail', hotelFormData.businessMail);
      formData.append('contactNumber', hotelFormData.contactNumber);
      formData.append('whatsappNumber', hotelFormData.whatsappNumber);
      formData.append('description', hotelFormData.description);
      
      // Only append locations if they exist
      if (hotelFormData.locations && hotelFormData.locations.length > 0) {
        hotelFormData.locations.forEach(loc => {
          formData.append('locations[]', loc);
        });
      }

      // Append images if they exist
      images.forEach(image => {
        if (image instanceof File && image.type.startsWith('image/')) {
          formData.append('hotelImage[]', image);
        }
      });

      let response;
      if (editingHotel) {
        response = await updateMyHotel(editingHotel.id, formData);
        setHotels(hotels.map(hotel => hotel.id === editingHotel.id ? response.data.hotel : hotel));
      } else {
        response = await createMyHotel(formData);
        setHotels([...hotels, response.data.hotel]);
      }
      
      setShowHotelForm(false);
      setEditingHotel(null);
      resetHotelForm();
      alert(editingHotel ? 'Hotel updated successfully!' : 'Hotel created successfully!');
    } catch (err) {
      console.error('Error saving hotel:', err);
      setError('Failed to save hotel. Please try again.');
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await deleteMyHotel(hotelId);
        setHotels(hotels.filter(hotel => hotel.id !== hotelId));
        alert('Hotel deleted successfully!');
      } catch (err) {
        console.error('Error deleting hotel:', err);
        setError('Failed to delete hotel.');
      }
    }
  };

  const startEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setHotelFormData({
      hotelName: hotel.hotelName,
      hotelAddress: hotel.hotelAddress,
      businessMail: hotel.businessMail,
      contactNumber: hotel.contactNumber,
      whatsappNumber: hotel.whatsappNumber,
      description: hotel.description || '',
      locations: hotel.locations || []
    });
    setImagePreviews(hotel.hotelImage ? hotel.hotelImage.map(img => `http://localhost:8000/storage/${img}`) : []);
    setImages([]);
    setShowHotelForm(true);
  };

  const resetHotelForm = () => {
    setHotelFormData({
      hotelName: '',
      hotelAddress: '',
      businessMail: '',
      contactNumber: '',
      whatsappNumber: '',
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

  const handleLocationChange = (location) => {
    setHotelFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      {/* Header Section - Always Visible */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <Building className="size-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Hotel Owner Dashboard</h3>
              <p className="text-blue-100">Manage your hotel properties</p>
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
            <div className="text-center py-8">Loading hotel owner data...</div>
          ) : hotelOwner ? (
            <>
              {/* Hotel Owner Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-800">Hotel Owner Details</h4>
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
                          Hotel Owner Name
                        </label>
                        <input
                          type="text"
                          value={ownerFormData.hotelOwnerName}
                          onChange={(e) => setOwnerFormData({...ownerFormData, hotelOwnerName: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NIC Number
                        </label>
                        <input
                          type="text"
                          value={ownerFormData.hotelOwnerNic}
                          onChange={(e) => setOwnerFormData({...ownerFormData, hotelOwnerNic: e.target.value})}
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
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          value={ownerFormData.contactNumber}
                          onChange={(e) => setOwnerFormData({...ownerFormData, contactNumber: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
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
                        <p className="font-medium">{hotelOwner.hotelOwnerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">NIC</p>
                        <p className="font-medium">{hotelOwner.hotelOwnerNic}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Business Email</p>
                        <p className="font-medium">{hotelOwner.businessMail}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Contact Number</p>
                        <p className="font-medium">{hotelOwner.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hotel Form */}
              {showHotelForm && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-lg font-semibold mb-4">
                    {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hotel Name *
                      </label>
                      <input
                        type="text"
                        value={hotelFormData.hotelName}
                        onChange={(e) => setHotelFormData({...hotelFormData, hotelName: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hotel Images
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
                        value={hotelFormData.description}
                        onChange={(e) => setHotelFormData({...hotelFormData, description: e.target.value})}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={hotelFormData.hotelAddress}
                        onChange={(e) => setHotelFormData({...hotelFormData, hotelAddress: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={hotelFormData.businessMail}
                        onChange={(e) => setHotelFormData({...hotelFormData, businessMail: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact No *
                      </label>
                      <input
                        type="tel"
                        value={hotelFormData.contactNumber}
                        onChange={(e) => setHotelFormData({...hotelFormData, contactNumber: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Whatsapp No *
                      </label>
                      <input
                        type="tel"
                        value={hotelFormData.whatsappNumber}
                        onChange={(e) => setHotelFormData({...hotelFormData, whatsappNumber: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Related Locations
                      </label>
                      {loadingLocations ? (
                        <div className="text-gray-500">Loading locations...</div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableLocations.map(location => (
                            <label key={location} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={hotelFormData.locations.includes(location)}
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
                        onClick={handleSaveHotel}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingHotel ? 'Update Hotel' : 'Add Hotel'}
                      </button>
                      <button
                        onClick={() => {
                          setShowHotelForm(false);
                          setEditingHotel(null);
                          resetHotelForm();
                        }}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hotel Section */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-gray-800">My Hotels ({hotels.length})</h4>
                <button
                  onClick={() => setShowHotelForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="size-5" />
                  Add Hotel
                </button>
              </div>

              {hotels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="size-12 mx-auto mb-4 text-gray-400" />
                  <p>No hotels found. Add your first hotel to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {hotel.hotelImage && hotel.hotelImage.length > 0 ? (
                        <img
                          src={`http://localhost:8000/storage/${hotel.hotelImage[0]}`}
                          alt={hotel.hotelName}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <Building className="size-12 text-gray-400" />
                        </div>
                      )}
                      <div className="p-4">
                        <h5 className="font-semibold text-lg text-gray-800 mb-2">{hotel.hotelName}</h5>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="size-4 mr-1" />
                          <span className="text-sm">{hotel.hotelAddress}</span>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="size-4 mr-2" />
                            <span>{hotel.businessMail}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="size-4 mr-2" />
                            <span>{hotel.contactNumber}</span>
                          </div>
                          {hotel.whatsappNumber && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MessageCircle className="size-4 mr-2" />
                              <span>{hotel.whatsappNumber}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.description}</p>
                        {hotel.locations && hotel.locations.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500">Locations:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {hotel.locations.map((location, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {location}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditHotel(hotel)}
                            className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 text-sm transition-colors"
                          >
                            <Edit3 className="size-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHotel(hotel.id)}
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
              <Building className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No hotel owner data available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelOwnerProfile;