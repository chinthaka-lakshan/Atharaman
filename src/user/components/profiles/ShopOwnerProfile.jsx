import React, { useState, useEffect } from 'react';
import { 
  Building, ChevronDown, ChevronUp, Plus, Edit3, Trash2, MapPin, 
  User, Mail, Phone, CreditCard, X, Upload, Package, DollarSign 
} from 'lucide-react';
import {
  getMyShopOwner,
  updateMyShopOwner,
  deleteMyShopOwner,
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
  
  const [ownerFormData, setOwnerFormData] = useState({
    shopOwnerName: '',
    shopOwnerNic: '',
    businessMail: '',
    contactNumber: ''
  });

  const [shopFormData, setShopFormData] = useState({
    shopName: '',
    shopAddress: '',
    description: '',
    locations: []
  });

  const [itemFormData, setItemFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    locations: [],
    shop_id: ''
  });

  const [shopImages, setShopImages] = useState([]);
  const [shopImagePreviews, setShopImagePreviews] = useState([]);
  const [itemImages, setItemImages] = useState([]);
  const [itemImagePreviews, setItemImagePreviews] = useState([]);
  const [removedShopImages, setRemovedShopImages] = useState([]);

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
      setShopOwner(ownerResponse.data);
      setOwnerFormData({
        shopOwnerName: ownerResponse.data.shopOwnerName,
        shopOwnerNic: ownerResponse.data.shopOwnerNic,
        businessMail: ownerResponse.data.businessMail,
        contactNumber: ownerResponse.data.contactNumber
      });
      
      const shopsResponse = await getMyShops();
      setShops(shopsResponse.data);
      
      // Fetch items for each shop
      const itemsData = {};
      for (const shop of shopsResponse.data) {
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
      const locationNames = response.data.map(location => location.locationName);
      setAvailableLocations(locationNames);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleUpdateOwner = async () => {
    try {
      const response = await updateMyShopOwner(ownerFormData);
      setShopOwner(response.data.shopOwner);
      setShowEditOwnerForm(false);
      alert('Shop owner details updated successfully!');
    } catch (err) {
      console.error('Error updating shop owner:', err);
      setError('Failed to update shop owner details.');
    }
  };

  const handleDeleteOwner = async () => {
    if (window.confirm('Are you sure you want to delete your shop owner profile? This will also remove all associated shops and items.')) {
      try {
        await deleteMyShopOwner();
        alert('Shop owner deleted successfully!');
        window.location.reload();
      } catch (err) {
        console.error('Error deleting shop owner:', err);
        setError('Failed to delete shop owner.');
      }
    }
  };

  const handleSaveShop = async () => {
    try {
      const formData = new FormData();
      formData.append('shopName', shopFormData.shopName);
      formData.append('shopAddress', shopFormData.shopAddress);
      formData.append('description', shopFormData.description);
      formData.append('user_id', userId);
      formData.append('shop_owner_id', shopOwner.id);
      
      if (shopFormData.locations && shopFormData.locations.length > 0) {
        shopFormData.locations.forEach(loc => {
          formData.append('locations[]', loc);
        });
      }

      // Append new images
      shopImages.forEach(image => {
        if (image instanceof File) {
          formData.append('shopImage[]', image);
        }
      });

      // Append removed image IDs for edit mode
      if (editingShop && removedShopImages.length > 0) {
        removedShopImages.forEach(imageId => {
          formData.append('removedImages[]', imageId);
        });
      }

      let response;
      if (editingShop) {
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
      setError('Failed to save shop. Please try again.');
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
        setError('Failed to delete shop.');
      }
    }
  };

  const handleSaveItem = async () => {
    try {
      const formData = new FormData();
      formData.append('itemName', itemFormData.itemName);
      formData.append('description', itemFormData.description || '');
      formData.append('price', itemFormData.price);
      formData.append('shop_id', itemFormData.shop_id);
      
      // Ensure locations is an array before using forEach
      const locationsArray = Array.isArray(itemFormData.locations) 
        ? itemFormData.locations 
        : [];
      
      if (locationsArray.length > 0) {
        locationsArray.forEach(loc => {
          formData.append('locations[]', loc);
        });
      }

      // Append item images
      itemImages.forEach(image => {
        if (image instanceof File) {
          formData.append('itemImage[]', image);
        }
      });

      let response;
      if (editingItem) {
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
      setError('Failed to save item. Please try again.');
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
        setError('Failed to delete item.');
      }
    }
  };

  const startEditShop = (shop) => {
    setEditingShop(shop);
    setRemovedShopImages([]);
  
    setShopFormData({
      shopName: shop.shopName,
      shopAddress: shop.shopAddress,
      description: shop.description || '',
      locations: shop.locations || []
    });

    // Set existing image previews
    if (shop.images && shop.images.length > 0) {
      const previews = shop.images.map(img => 
        `http://localhost:8000/storage/${img.image_path}`
      );
      setShopImagePreviews(previews);
    } else {
      setShopImagePreviews([]);
    }

    setShopImages([]);
    setShowShopForm(true);
  };

  const startEditItem = (item, shopId) => {
    setEditingItem(item);

    setItemFormData({
      itemName: item.itemName,
      description: item.description || '',
      price: item.price,
      locations: item.locations || [],
      shop_id: shopId
    });

    // Set existing item image previews
    if (item.images && item.images.length > 0) {
      const previews = item.images.map(img => 
        `http://localhost:8000/storage/${img.image_path}`
      );
      setItemImagePreviews(previews);
    } else {
      setItemImagePreviews([]);
    }

    setItemImages([]);
    setShowItemForm(true);
  };

  const resetShopForm = () => {
    setShopFormData({
      shopName: '',
      shopAddress: '',
      description: '',
      locations: []
    });
    setShopImages([]);
    setShopImagePreviews([]);
    setRemovedShopImages([]);
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
    setItemImagePreviews([]);
  };

  const handleShopImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)
    );
    
    const newImages = [...shopImages, ...validImageFiles];
    setShopImages(newImages);
    
    const newPreviews = validImageFiles.map(file => URL.createObjectURL(file));
    setShopImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleItemImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)
    );
    
    const newImages = [...itemImages, ...validImageFiles];
    setItemImages(newImages);
    
    const newPreviews = validImageFiles.map(file => URL.createObjectURL(file));
    setItemImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeShopImage = (index, isExisting = false, imageId = null) => {
    if (isExisting && imageId) {
      // Remove existing image (mark for deletion)
      setRemovedShopImages(prev => [...prev, imageId]);
      const newPreviews = [...shopImagePreviews];
      newPreviews.splice(index, 1);
      setShopImagePreviews(newPreviews);
    } else {
      // Remove new image
      const newImages = [...shopImages];
      const newPreviews = [...shopImagePreviews];
      
      if (newPreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      
      setShopImages(newImages);
      setShopImagePreviews(newPreviews);
    }
  };

  const removeItemImage = (index) => {
    const newImages = [...itemImages];
    const newPreviews = [...itemImagePreviews];
    
    if (newPreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setItemImages(newImages);
    setItemImagePreviews(newPreviews);
  };

  const handleShopLocationChange = (location) => {
    setShopFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
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

  const toggleShopExpand = (shopId) => {
    setExpandedShop(expandedShop === shopId ? null : shopId);
    if (expandedShop !== shopId && (!items[shopId] || items[shopId].length === 0)) {
      fetchShopItems(shopId);
    }
  };

  // Image URL helper
  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
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
            <div className="text-center py-8">Loading shop owner data...</div>
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
                          Shop Owner Name
                        </label>
                        <input
                          type="text"
                          value={ownerFormData.shopOwnerName}
                          onChange={(e) => setOwnerFormData({...ownerFormData, shopOwnerName: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NIC Number
                        </label>
                        <input
                          type="text"
                          value={ownerFormData.shopOwnerNic}
                          onChange={(e) => setOwnerFormData({...ownerFormData, shopOwnerNic: e.target.value})}
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
                        <p className="font-medium">{shopOwner.shopOwnerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">NIC</p>
                        <p className="font-medium">{shopOwner.shopOwnerNic}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Business Email</p>
                        <p className="font-medium">{shopOwner.businessMail}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="size-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Contact Number</p>
                        <p className="font-medium">{shopOwner.contactNumber}</p>
                      </div>
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shop Name *
                      </label>
                      <input
                        type="text"
                        value={shopFormData.shopName}
                        onChange={(e) => setShopFormData({...shopFormData, shopName: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shop Images (Max 5)
                      </label>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {shopImagePreviews.map((preview, index) => {
                          const isExisting = !preview.startsWith('blob:');
                          const existingImage = editingShop?.images?.[index];
                          return (
                            <div key={index} className="relative h-32 w-32">
                              <img
                                src={preview}
                                alt={`Preview ${index}`}
                                className="h-full w-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeShopImage(
                                  index, 
                                  isExisting, 
                                  existingImage?.id
                                )}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                              >
                                <X className="w-4 h-4 text-gray-700" />
                              </button>
                              {isExisting && (
                                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  Existing
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {shopImagePreviews.length < 5 && (
                        <div className="flex flex-col">
                          <label 
                            htmlFor="shopFileInput"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-40"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            <span className="text-sm">Upload Images</span>
                          </label>
                          <input
                            type="file"
                            id="shopFileInput"
                            onChange={handleShopImageChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {5 - shopImagePreviews.length} slots remaining
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={shopFormData.description}
                        onChange={(e) => setShopFormData({...shopFormData, description: e.target.value})}
                        required
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
                        value={shopFormData.shopAddress}
                        onChange={(e) => setShopFormData({...shopFormData, shopAddress: e.target.value})}
                        required
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

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSaveShop}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingShop ? 'Update Shop' : 'Add Shop'}
                      </button>
                      <button
                        onClick={() => {
                          setShowShopForm(false);
                          setEditingShop(null);
                          resetShopForm();
                        }}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shop *
                      </label>
                      <select
                        value={itemFormData.shop_id}
                        onChange={(e) => setItemFormData({...itemFormData, shop_id: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={editingItem} // Can't change shop for existing item
                      >
                        <option value="">Select a Shop</option>
                        {shops.map(shop => (
                          <option key={shop.id} value={shop.id}>
                            {shop.shopName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={itemFormData.itemName}
                        onChange={(e) => setItemFormData({...itemFormData, itemName: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={itemFormData.price}
                        onChange={(e) => setItemFormData({...itemFormData, price: e.target.value})}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Images
                      </label>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {itemImagePreviews.map((preview, index) => (
                          <div key={index} className="relative h-32 w-32">
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeItemImage(index)}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                              <X className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        <label 
                          htmlFor="itemFileInput"
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-40"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          <span className="text-sm">Upload Images</span>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={itemFormData.description}
                        onChange={(e) => setItemFormData({...itemFormData, description: e.target.value})}
                        required
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

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSaveItem}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </button>
                      <button
                        onClick={() => {
                          setShowItemForm(false);
                          setEditingItem(null);
                          resetItemForm();
                        }}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
                              alt={shop.shopName}
                              className="w-12 h-12 object-cover rounded-lg mr-3 border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                              <Building className="size-6 text-gray-400" />
                            </div>
                          )}

                          <div>
                            <h5 className="font-semibold text-lg text-gray-800">{shop.shopName}</h5>
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
                                      alt={image.alt_text || `${shop.shopName} - Image ${index + 1}`}
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
                              <span className="text-sm text-gray-600">{shop.shopAddress}</span>
                            </div>
                            {shop.locations && shop.locations.length > 0 && (
                              <div>
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
                          </div>

                          {shop.description && (
                            <p className="text-gray-600 mb-6">{shop.description}</p>
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
                                    {item.images && item.images.length > 0 ? (
                                      <img
                                        src={getImageUrl(item.images[0].image_path)}
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
              <p>No shop owner data available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopOwnerProfile;