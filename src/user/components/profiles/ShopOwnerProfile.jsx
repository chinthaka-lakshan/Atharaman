import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Building, ChevronDown, ChevronUp, Plus, Edit3, Trash2, MapPin, User, Mail, Phone, CreditCard, X, Upload, Package, DollarSign, Calendar, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  getMyShopOwner, 
  updateMyShopOwner, 
  deleteMyShopOwner, 
  checkNicAvailability,
  getMyShops,
  createMyShop,
  updateMyShop,
  deleteMyShop,
  getLocations,
  getItemsByAuthenticatedShop,
  createMyItem,
  updateMyItem,
  deleteMyItem
} from '../../../services/api';
import { FaWhatsapp } from 'react-icons/fa6';

const ShopOwnerProfile = ({ isExpanded, onToggleExpand, userId }) => {
  const [shopOwner, setShopOwner] = useState(null);
  const [shops, setShops] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditOwnerForm, setShowEditOwnerForm] = useState(false);
  const [showShopForm, setShowShopForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedShop, setExpandedShop] = useState(null);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Shop Owner Form Data
  const [ownerFormData, setOwnerFormData] = useState({
    shop_owner_name: '',
    shop_owner_nic: '',
    shop_owner_dob: '',
    shop_owner_address: '',
    business_mail: '',
    contact_number: '',
    whatsapp_number: ''
  });

  // Shop Form Data
  const [shopFormData, setShopFormData] = useState({
    shop_name: '',
    nearest_city: '',
    shop_address: '',
    contact_number: '',
    whatsapp_number: '',
    short_description: '',
    long_description: '',
    locations: []
  });

  // Item Form Data
  const [itemFormData, setItemFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    locations: [],
    shop_id: ''
  });

  // Image States
  const [shopImages, setShopImages] = useState([]);
  const [existingShopImages, setExistingShopImages] = useState([]);
  const [shopImagesToRemove, setShopImagesToRemove] = useState([]);
  const [itemImages, setItemImages] = useState([]);

  // NIC Validation State
  const [nicValidation, setNicValidation] = useState({
    loading: false,
    available: null,
    message: ''
  });
  const [nicDebounceTimer, setNicDebounceTimer] = useState(null);

  const genderOptions = ['Male', 'Female', 'Other'];

  // Fetch data only when expanded
  useEffect(() => {
    if (isExpanded && userId) {
      fetchShopOwnerData();
      fetchLocations();
    }
  }, [isExpanded, userId]);

  const fetchShopOwnerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ownerResponse = await getMyShopOwner();
      const shopOwnerData = ownerResponse.data;
      setShopOwner(shopOwnerData);

      // Set form data with correct field names
      setOwnerFormData({
        shop_owner_name: shopOwnerData.shop_owner_name || '',
        shop_owner_nic: shopOwnerData.shop_owner_nic || '',
        shop_owner_dob: shopOwnerData.shop_owner_dob || '',
        shop_owner_address: shopOwnerData.shop_owner_address || '',
        business_mail: shopOwnerData.business_mail || '',
        contact_number: shopOwnerData.contact_number || '',
        whatsapp_number: shopOwnerData.whatsapp_number || ''
      });

      // Fetch shops
      const shopsResponse = await getMyShops();
      const shopData = shopsResponse.data;
      setShops(shopData);

      // Fetch items for each shop
      const itemsData = {};
      for (const shop of shopData) {
        try {
          const itemsResponse = await getItemsByAuthenticatedShop(shop.id);
          itemsData[shop.id] = itemsResponse.data;
        } catch (err) {
          console.error(`Error fetching items for shop ${shop.id}:`, err);
          itemsData[shop.id] = [];
        }
      }
      setItems(itemsData);
    } catch (err) {
      console.error('Error fetching shop owner data:', err);
      setError('Failed to load shop owner data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchShopItems = async (shopId) => {
    try {
      const response = await getItemsByAuthenticatedShop(shopId);
      setItems(prev => ({
        ...prev,
        [shopId]: response.data
      }));
    } catch (err) {
      console.error(`Error fetching items for shop ${shopId}:`, err);
      setError('Failed to load items. Please try again.');
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
    if (shopOwner && nicValue === shopOwner.shop_owner_nic) {
      setNicValidation({ loading: false, available: true, message: 'Current NIC' });
      return;
    }

    setNicValidation({ loading: true, available: null, message: 'Checking NIC availability...' });
    
    try {
      const response = await checkNicAvailability({
        nic: nicValue,
        role: 'shop_owner',
        current_shop_owner_id: shopOwner?.id
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
  }, [shopOwner]);

  // Debounced NIC validation
  useEffect(() => {
    const nicValue = ownerFormData.shop_owner_nic;
    
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
  }, [ownerFormData.shop_owner_nic, validateNic]);

  // Shop Owner Form Handlers
  const handleOwnerInputChange = (e) => {
    const { name, value } = e.target;
    setOwnerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateOwner = async () => {
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
      
      // Append all shop owner fields with correct field names
      Object.keys(ownerFormData).forEach(key => {
        formData.append(key, ownerFormData[key]);
      });

      // Add method spoofing for PUT
      formData.append('_method', 'PUT');

      const response = await updateMyShopOwner(formData);
      setShopOwner(response.data.shopOwner);
      setShowEditOwnerForm(false);
      alert('Shop owner details updated successfully!');
    } catch (err) {
      console.error('Error updating shop owner:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update shop owner details.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOwner = async () => {
    if (window.confirm('Are you sure you want to delete your shop owner profile? This will also remove all associated shops and items.')) {
      try {
        await deleteMyShopOwner();
        alert('Shop owner profile deleted successfully!');
        window.location.reload();
      } catch (err) {
        console.error('Error deleting shop owner:', err);
        const errorMessage = err.response?.data?.error || 'Failed to delete shop owner profile.';
        setError(errorMessage);
      }
    }
  };

  // Shop Form Handlers
  const handleShopInputChange = (e) => {
    const { name, value } = e.target;
    setShopFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShopLocationChange = (location) => {
    setShopFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleShopImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const currentImageCount = existingShopImages.length - shopImagesToRemove.length;
    const totalAfterAdd = currentImageCount + shopImages.length + files.length;
    
    if (totalAfterAdd > 5) {
      alert(`Maximum 5 images allowed. You currently have ${currentImageCount + shopImages.length} images.`);
      return;
    }
    
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)
    );
    
    setShopImages(prev => [...prev, ...validImageFiles]);
    e.target.value = '';
  };

  const removeNewShopImage = (index) => {
    setShopImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingShopImage = (imageId) => {
    setShopImagesToRemove(prev => [...prev, imageId]);
    setExistingShopImages(prev => prev.filter(img => img.id !== imageId));
  };

  const restoreExistingShopImage = (imageId) => {
    setShopImagesToRemove(prev => prev.filter(id => id !== imageId));
    if (editingShop) {
      const originalImage = editingShop.images.find(img => img.id === imageId);
      if (originalImage) {
        setExistingShopImages(prev => [...prev, originalImage]);
      }
    }
  };

  const handleSaveShop = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Append all shop fields
      Object.keys(shopFormData).forEach(key => {
        if (key === 'locations') {
          shopFormData[key].forEach(item => {
            formData.append(`${key}[]`, item);
          });
        } else if (shopFormData[key] !== null && shopFormData[key] !== undefined) {
          formData.append(key, shopFormData[key]);
        }
      });

      // Append shop owner ID and user ID
      formData.append('shop_owner_id', shopOwner.id);
      formData.append('user_id', userId);

      // Append new images
      shopImages.forEach(img => {
        formData.append('shopImage[]', img);
      });

      // Append images to remove for edit mode
      if (editingShop && shopImagesToRemove.length > 0) {
        shopImagesToRemove.forEach(imageId => {
          formData.append('removedImages[]', imageId);
        });
      }

      let response;
      if (editingShop) {
        formData.append('_method', 'PUT');
        response = await updateMyShop(editingShop.id, formData);
        setShops(shops.map(shop => shop.id === editingShop.id ? response.data.shop : shop));
      } else {
        response = await createMyShop(formData);
        setShops([...shops, response.data.shop]);
      }
      
      setShowShopForm(false);
      setEditingShop(null);
      resetShopForm();
      alert(editingShop ? 'Shop updated successfully!' : 'Shop created successfully!');
    } catch (err) {
      console.error('Error saving shop:', err);
      const errorMessage = err.response?.data?.error || 'Failed to save shop. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (window.confirm('Are you sure you want to delete this shop? All items in this shop will also be deleted.')) {
      try {
        await deleteMyShop(shopId);
        setShops(shops.filter(shop => shop.id !== shopId));
        
        // Remove items for this shop from state
        setItems(prev => {
          const newItems = { ...prev };
          delete newItems[shopId];
          return newItems;
        });
        
        alert('Shop deleted successfully!');
      } catch (err) {
        console.error('Error deleting shop:', err);
        const errorMessage = err.response?.data?.error || 'Failed to delete shop.';
        setError(errorMessage);
      }
    }
  };

  // Item Form Handlers
  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemLocationChange = (location) => {
    setItemFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleItemImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)
    );
    
    setItemImages(prev => [...prev, ...validImageFiles]);
    e.target.value = '';
  };

  const removeItemImage = (index) => {
    setItemImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveItem = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Append all item fields
      Object.keys(itemFormData).forEach(key => {
        if (key === 'locations') {
          itemFormData[key].forEach(item => {
            formData.append(`${key}[]`, item);
          });
        } else if (itemFormData[key] !== null && itemFormData[key] !== undefined) {
          formData.append(key, itemFormData[key]);
        }
      });

      // Append item images
      itemImages.forEach(img => {
        formData.append('itemImage[]', img);
      });

      let response;
      if (editingItem) {
        formData.append('_method', 'PUT');
        response = await updateMyItem(editingItem.id, formData);
        // Update items for this shop
        setItems(prev => ({
          ...prev,
          [itemFormData.shop_id]: prev[itemFormData.shop_id].map(item => 
            item.id === editingItem.id ? response.data.item : item
          )
        }));
      } else {
        response = await createMyItem(formData);
        // Add new item to the shop
        setItems(prev => ({
          ...prev,
          [itemFormData.shop_id]: [...(prev[itemFormData.shop_id] || []), response.data.item]
        }));
      }
      
      setShowItemForm(false);
      setEditingItem(null);
      resetItemForm();
      alert(editingItem ? 'Item updated successfully!' : 'Item created successfully!');
    } catch (err) {
      console.error('Error saving item:', err);
      const errorMessage = err.response?.data?.error || 'Failed to save item. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId, shopId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMyItem(itemId);
        setItems(prev => ({
          ...prev,
          [shopId]: prev[shopId].filter(item => item.id !== itemId)
        }));
        alert('Item deleted successfully!');
      } catch (err) {
        console.error('Error deleting item:', err);
        const errorMessage = err.response?.data?.error || 'Failed to delete item.';
        setError(errorMessage);
      }
    }
  };

  // Form Management
  const startEditShop = (shop) => {
    setEditingShop(shop);
    setShopFormData({
      shop_name: shop.shop_name || '',
      nearest_city: shop.nearest_city || '',
      shop_address: shop.shop_address || '',
      contact_number: shop.contact_number || '',
      whatsapp_number: shop.whatsapp_number || '',
      short_description: shop.short_description || '',
      long_description: shop.long_description || '',
      locations: shop.locations || []
    });
    setExistingShopImages(shop.images || []);
    setShopImages([]);
    setShopImagesToRemove([]);
    setShowShopForm(true);
  };

  const startEditItem = (item, shopId) => {
    setEditingItem(item);
    setItemFormData({
      itemName: item.itemName || '',
      description: item.description || '',
      price: item.price || '',
      locations: item.locations || [],
      shop_id: shopId
    });
    setItemImages([]);
    setShowItemForm(true);
  };

  const resetShopForm = () => {
    setShopFormData({
      shop_name: '',
      nearest_city: '',
      shop_address: '',
      contact_number: '',
      whatsapp_number: '',
      short_description: '',
      long_description: '',
      locations: []
    });
    setShopImages([]);
    setExistingShopImages([]);
    setShopImagesToRemove([]);
  };

  const resetItemForm = () => {
    setItemFormData({
      itemName: '',
      description: '',
      price: '',
      locations: [],
      shop_id: ''
    });
    setItemImages([]);
  };

  const toggleShopExpand = (shopId) => {
    setExpandedShop(expandedShop === shopId ? null : shopId);
    if (expandedShop !== shopId && (!items[shopId] || items[shopId].length === 0)) {
      fetchShopItems(shopId);
    }
  };

  // Image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-shop.jpg';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
  };

  // Calculate image slots for shop
  const currentShopImageCount = existingShopImages.length - shopImagesToRemove.length;
  const totalShopImages = currentShopImageCount + shopImages.length;
  const remainingShopSlots = Math.max(0, 5 - totalShopImages);

  // Removed shop images
  const removedShopImages = editingShop ? editingShop.images.filter(img => shopImagesToRemove.includes(img.id)) : [];

  // NIC Validation Indicator Component
  const NicValidationIndicator = () => {
    const nicValue = ownerFormData.shop_owner_nic;
    
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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <Building className="size-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Shop Owner Dashboard</h3>
              <p className="text-blue-100">Manage your shops and items</p>
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
              <Loader className="size-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p>Loading shop owner data...</p>
            </div>
          ) : shopOwner ? (
            <>
              {/* Shop Owner Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-800">Shop Owner Details</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditOwnerForm(!showEditOwnerForm)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-sm"
                    >
                      <Edit3 className="size-4" />
                      {showEditOwnerForm ? 'Cancel Edit' : 'Edit Details'}
                    </button>
                    <button
                      onClick={handleDeleteOwner}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors text-sm"
                    >
                      <Trash2 className="size-4" />
                      Delete Profile
                    </button>
                  </div>
                </div>
                
                {showEditOwnerForm ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shop Owner Name *
                        </label>
                        <input
                          type="text"
                          name="shop_owner_name"
                          value={ownerFormData.shop_owner_name}
                          onChange={handleOwnerInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NIC Number *
                        </label>
                        <input
                          type="text"
                          name="shop_owner_nic"
                          value={ownerFormData.shop_owner_nic}
                          onChange={handleOwnerInputChange}
                          required
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                            nicValidation.available === false 
                              ? 'border-red-300 focus:ring-red-500' 
                              : nicValidation.available === true
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
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
                          name="shop_owner_dob"
                          value={ownerFormData.shop_owner_dob}
                          onChange={handleOwnerInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Email *
                        </label>
                        <input
                          type="email"
                          name="business_mail"
                          value={ownerFormData.business_mail}
                          onChange={handleOwnerInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number *
                        </label>
                        <input
                          type="tel"
                          name="contact_number"
                          value={ownerFormData.contact_number}
                          onChange={handleOwnerInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="whatsapp_number"
                          value={ownerFormData.whatsapp_number}
                          onChange={handleOwnerInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        name="shop_owner_address"
                        value={ownerFormData.shop_owner_address}
                        onChange={handleOwnerInputChange}
                        required
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleUpdateOwner}
                        disabled={submitting || nicValidation.available === false}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting && <Loader className="size-4 animate-spin" />}
                        {submitting ? 'Updating...' : 'Update Details'}
                      </button>
                      <button
                        onClick={() => setShowEditOwnerForm(false)}
                        disabled={submitting}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode for Shop Owner
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <User className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{shopOwner.shop_owner_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">NIC</p>
                          <p className="font-medium">{shopOwner.shop_owner_nic}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Business Email</p>
                          <p className="font-medium">{shopOwner.business_mail}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Contact Number</p>
                          <p className="font-medium">{shopOwner.contact_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaWhatsapp className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">WhatsApp Number</p>
                          <p className="font-medium">{shopOwner.whatsapp_number || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="size-5 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium">{new Date(shopOwner.shop_owner_dob).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="font-medium">{shopOwner.shop_owner_address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shop Form */}
              {showShopForm && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-lg font-semibold mb-4">
                    {editingShop ? 'Edit Shop' : 'Add New Shop'}
                  </h5>
                  <div className="space-y-6">
                    {/* Shop Image Management */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shop Images {remainingShopSlots >= 0 && `(${remainingShopSlots} remaining)`}
                      </label>

                      {/* Removed Images */}
                      {removedShopImages.length > 0 && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800 mb-2 font-medium">
                            {removedShopImages.length} image{removedShopImages.length !== 1 ? 's' : ''} marked for removal
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {removedShopImages.map((img) => (
                              <div key={img.id} className="relative h-32 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center opacity-60">
                                <img 
                                  src={getImageUrl(img.image_path)}
                                  alt={img.alt_text}
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => restoreExistingShopImage(img.id)}
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
                      {existingShopImages.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Existing Images (click × to remove):</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {existingShopImages.map((img) => (
                              <div key={img.id} className="relative h-32 border border-gray-300 rounded-lg flex items-center justify-center group">
                                <img 
                                  src={getImageUrl(img.image_path)}
                                  alt={img.alt_text}
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeExistingShopImage(img.id)}
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
                      {(shopImages.length > 0 || remainingShopSlots > 0) && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">New Images:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {shopImages.map((img, index) => (
                              <div key={`new-${index}`} className="relative h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50">
                                <img 
                                  src={URL.createObjectURL(img)} 
                                  alt={`New ${index}`}
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeNewShopImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                  New #{index + 1}
                                </div>
                              </div>
                            ))}
                            
                            {remainingShopSlots > 0 && (
                              <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                <label htmlFor="shopFileInput" className="flex flex-col items-center cursor-pointer p-4 text-center w-full h-full justify-center">
                                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-600">Add Images</span>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {remainingShopSlots} slot{remainingShopSlots !== 1 ? 's' : ''} remaining
                                  </span>
                                </label>
                                <input
                                  type="file"
                                  id="shopFileInput"
                                  onChange={handleShopImageChange}
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
                        <p>• Maximum 5 images per shop</p>
                        <p>• Currently using: {totalShopImages}/5 slots</p>
                        <p>• Supported formats: JPEG, PNG, GIF, WEBP</p>
                        <p>• Maximum file size: 2MB per image</p>
                      </div>
                    </div>

                    {/* Shop Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shop Name *
                        </label>
                        <input
                          type="text"
                          name="shop_name"
                          value={shopFormData.shop_name}
                          onChange={handleShopInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nearest City *
                        </label>
                        <input
                          type="text"
                          name="nearest_city"
                          value={shopFormData.nearest_city}
                          onChange={handleShopInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number *
                        </label>
                        <input
                          type="tel"
                          name="contact_number"
                          value={shopFormData.contact_number}
                          onChange={handleShopInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="whatsapp_number"
                          value={shopFormData.whatsapp_number}
                          onChange={handleShopInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Address
                      </label>
                      <textarea
                        name="shop_address"
                        value={shopFormData.shop_address}
                        onChange={handleShopInputChange}
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description *
                      </label>
                      <textarea
                        name="short_description"
                        value={shopFormData.short_description}
                        onChange={handleShopInputChange}
                        required
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength="1000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {shopFormData.short_description.length}/1000 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        name="long_description"
                        value={shopFormData.long_description}
                        onChange={handleShopInputChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength="10000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {shopFormData.long_description.length}/10000 characters
                      </p>
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
                                checked={shopFormData.locations.includes(location)}
                                onChange={() => handleShopLocationChange(location)}
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
                        onClick={handleSaveShop}
                        disabled={submitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting && <Loader className="size-4 animate-spin" />}
                        {editingShop ? 'Update Shop' : 'Add Shop'}
                      </button>
                      <button
                        onClick={() => {
                          setShowShopForm(false);
                          setEditingShop(null);
                          resetShopForm();
                        }}
                        disabled={submitting}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Item Form */}
              {showItemForm && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-lg font-semibold mb-4">
                    {editingItem ? 'Edit Item' : 'Add New Item'}
                  </h5>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop *
                      </label>
                      <select
                        name="shop_id"
                        value={itemFormData.shop_id}
                        onChange={handleItemInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={editingItem} // Can't change shop for existing item
                      >
                        <option value="">Select a Shop</option>
                        {shops.map(shop => (
                          <option key={shop.id} value={shop.id}>
                            {shop.shop_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        name="itemName"
                        value={itemFormData.itemName}
                        onChange={handleItemInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={itemFormData.price}
                        onChange={handleItemInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Item Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Images
                      </label>
                      {itemImages.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">New Images:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {itemImages.map((img, index) => (
                              <div key={`item-new-${index}`} className="relative h-32 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50">
                                <img 
                                  src={URL.createObjectURL(img)} 
                                  alt={`New ${index}`}
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeItemImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                  New #{index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                        <label htmlFor="itemFileInput" className="flex flex-col items-center cursor-pointer p-4 text-center w-full h-full justify-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Add Item Images</span>
                        </label>
                        <input
                          type="file"
                          id="itemFileInput"
                          onChange={handleItemImageChange}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={itemFormData.description}
                        onChange={handleItemInputChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Locations
                      </label>
                      {loadingLocations ? (
                        <div className="text-gray-500">Loading locations...</div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableLocations.map(location => (
                            <label key={location} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={itemFormData.locations.includes(location)}
                                onChange={() => handleItemLocationChange(location)}
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
                        onClick={handleSaveItem}
                        disabled={submitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting && <Loader className="size-4 animate-spin" />}
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </button>
                      <button
                        onClick={() => {
                          setShowItemForm(false);
                          setEditingItem(null);
                          resetItemForm();
                        }}
                        disabled={submitting}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Shops Section */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-gray-800">My Shops ({shops.length})</h4>
                <button
                  onClick={() => {
                    setShowShopForm(true);
                    setEditingShop(null);
                    resetShopForm();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="size-5" />
                  Add Shop
                </button>
              </div>

              {shops.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="size-12 mx-auto mb-4 text-gray-400" />
                  <p>No shops found. Add your first shop to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {shops.map((shop) => (
                    <div key={shop.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleShopExpand(shop.id)}
                            className="mr-3 text-gray-600 hover:text-gray-800"
                          >
                            {expandedShop === shop.id ? (
                              <ChevronUp className="size-5" />
                            ) : (
                              <ChevronDown className="size-5" />
                            )}
                          </button>

                          {/* Shop thumbnail */}
                          {shop.images && shop.images.length > 0 ? (
                            <img
                              src={getImageUrl(shop.images[0].image_path)}
                              alt={shop.shop_name}
                              className="w-12 h-12 object-cover rounded-lg mr-3 border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                              <Building className="size-6 text-gray-400" />
                            </div>
                          )}

                          <div>
                            <h5 className="font-semibold text-lg text-gray-800">{shop.shop_name}</h5>
                            <span className="ml-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {items[shop.id]?.length || 0} items
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setItemFormData(prev => ({ ...prev, shop_id: shop.id }));
                              setShowItemForm(true);
                              setEditingItem(null);
                              resetItemForm();
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors text-sm"
                          >
                            <Plus className="size-4" />
                            Add Item
                          </button>
                          <button
                            onClick={() => startEditShop(shop)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-sm"
                          >
                            <Edit3 className="size-4" />
                            Edit Shop
                          </button>
                          <button
                            onClick={() => handleDeleteShop(shop.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors text-sm"
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                        </div>
                      </div>

                      {expandedShop === shop.id && (
                        <div className="p-4 bg-white">
                          {/* Shop Images Section */}
                          {shop.images && shop.images.length > 0 && (
                            <div className="mb-6">
                              <h6 className="font-semibold text-gray-800 mb-3">Shop Images</h6>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {shop.images.map((image, index) => (
                                  <div key={image.id} className="relative h-32 w-full">
                                    <img
                                      src={getImageUrl(image.image_path)}
                                      alt={image.alt_text || `${shop.shop_name} - Image ${index + 1}`}
                                      className="h-full w-full object-cover rounded-lg border border-gray-200"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center">
                              <MapPin className="size-4 text-gray-600 mr-2" />
                              <span className="text-sm text-gray-600">{shop.shop_address}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="size-4 text-gray-600 mr-2" />
                              <span className="text-sm text-gray-600">Nearest City: {shop.nearest_city}</span>
                            </div>
                            {shop.contact_number && (
                              <div className="flex items-center">
                                <Phone className="size-4 text-gray-600 mr-2" />
                                <span className="text-sm text-gray-600">{shop.contact_number}</span>
                              </div>
                            )}
                            {shop.whatsapp_number && (
                              <div className="flex items-center">
                                <FaWhatsapp className="size-4 text-gray-600 mr-2" />
                                <span className="text-sm text-gray-600">{shop.whatsapp_number}</span>
                              </div>
                            )}
                          </div>

                          {shop.locations && shop.locations.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 mb-1">Available in:</p>
                              <div className="flex flex-wrap gap-1">
                                {shop.locations.map((location, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {location}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {shop.short_description && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-1">Short Description:</p>
                              <p className="text-gray-600">{shop.short_description}</p>
                            </div>
                          )}

                          {shop.long_description && (
                            <div className="mb-6">
                              <p className="text-sm font-medium text-gray-700 mb-1">Detailed Description:</p>
                              <p className="text-gray-600 whitespace-pre-line">{shop.long_description}</p>
                            </div>
                          )}

                          {/* Items for this shop */}
                          <div className="mt-6">
                            <h6 className="font-semibold text-gray-800 mb-4 flex items-center">
                              <Package className="size-5 mr-2" />
                              Items ({items[shop.id]?.length || 0})
                            </h6>
                            
                            {!items[shop.id] || items[shop.id].length === 0 ? (
                              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <Package className="size-12 mx-auto mb-4 text-gray-400" />
                                <p>No items found in this shop.</p>
                                <button
                                  onClick={() => {
                                    setItemFormData(prev => ({ ...prev, shop_id: shop.id }));
                                    setShowItemForm(true);
                                  }}
                                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  Add Your First Item
                                </button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items[shop.id].map((item) => (
                                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    {item.itemImage && item.itemImage.length > 0 ? (
                                      <img
                                        src={getImageUrl(JSON.parse(item.itemImage)[0])}
                                        alt={item.itemName}
                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                      />
                                    ) : (
                                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                                        <Package className="size-8 text-gray-400" />
                                      </div>
                                    )}
                                    
                                    <h6 className="font-semibold text-gray-800 mb-2">{item.itemName}</h6>
                                    
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="flex items-center text-green-600 font-semibold">
                                        <DollarSign className="size-4 mr-1" />
                                        {item.price}
                                      </span>
                                      {item.locations && item.locations.length > 0 && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                          {item.locations.length} locations
                                        </span>
                                      )}
                                    </div>
                                    
                                    {item.description && (
                                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                                    )}
                                    
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => startEditItem(item, shop.id)}
                                        className="flex-1 bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                      >
                                        <Edit3 className="size-3" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(item.id, shop.id)}
                                        className="flex-1 bg-red-50 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                      >
                                        <Trash2 className="size-3" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No shop owner profile found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopOwnerProfile;