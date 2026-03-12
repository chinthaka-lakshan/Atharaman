import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ShopOwnerForm from '../components/forms/ShopOwnerForm';
import ShopForm from '../components/forms/ShopForm';
import ShopOwnerView from '../components/views/ShopOwnerView';
import ShopView from '../components/views/ShopView';
import {
  getShopOwners,
  getShopOwnerById,
  createShopOwner,
  updateShopOwner,
  deleteShopOwner,
  getShopsByOwner,
  getShopById,
  createShop,
  updateShop,
  deleteShop
} from '../../services/api';

const ManageShopOwners = () => {
  const [currentView, setCurrentView] = useState('owners'); // 'owners' or 'shops'
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedShopOwner, setSelectedShopOwner] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopOwners, setShopOwners] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch shop owners on component mount
  useEffect(() => {
    fetchShopOwners();
  }, []);

  const fetchShopOwners = async () => {
    setLoading(true);
    try {
      const response = await getShopOwners();
      setShopOwners(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch shop owners. Please try again.');
      console.error('Error fetching shop owners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch shops when selected owner changes
  useEffect(() => {
    if (selectedOwner) {
      fetchShopsByOwner(selectedOwner.id);
    }
  }, [selectedOwner]);

  const fetchShopsByOwner = async (ownerId) => {
    setLoading(true);
    try {
      const response = await getShopsByOwner(ownerId);
      setShops(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch shops. Please try again.');
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const ownerColumns = [
    { key: 'shop_owner_name', label: 'Shop Owner Name', sortable: true },
    { key: 'shop_owner_nic', label: 'NIC', sortable: true },
    { key: 'business_mail', label: 'Email', sortable: true },
    { key: 'contact_number', label: 'Phone', sortable: true },
  ];

  const shopColumns = [
    { key: 'shop_name', label: 'Shop Name', sortable: true },
    { key: 'nearest_city', label: 'City', sortable: true },
    { key: 'contact_number', label: 'Contact', sortable: true },
    { key: 'shop_address', label: 'Address', sortable: true },
  ];

  const handleOwnerRowClick = (owner) => {
    setSelectedOwner(owner);
    setCurrentView('shops');
  };

  const handleBackToOwners = () => {
    setCurrentView('owners');
    setSelectedOwner(null);
    setSelectedShop(null);
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedShopOwner(null);
    setSelectedShop(null);
    setShowModal(true);
  };

  const handleView = async (item) => {
    try {
      if (currentView === 'owners') {
        const response = await getShopOwnerById(item.id);
        setModalType('view');
        setSelectedShopOwner(response.data);
        setShowModal(true);
      } else {
        const response = await getShopById(item.id);
        setModalType('view');
        setSelectedShop(response.data);
        setShowModal(true);
      }
    } catch (error) {
      setError('Failed to fetch details. Please try again.');
      console.error('Error fetching details:', error);
    }
  };

  const handleEdit = (item) => {
    setModalType('edit');
    if (currentView === 'owners') {
      setSelectedShopOwner(item);
      setSelectedShop(null);
    } else {
      setSelectedShop(item);
      setSelectedShopOwner(null);
    }
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    const itemName = currentView === 'owners' ? item.shop_owner_name : item.shopName;
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        setLoading(true);
        if (currentView === 'owners') {
          await deleteShopOwner(item.id);
          setShopOwners(shopOwners.filter(o => o.id !== item.id));
          setError(null);
        } else {
          await deleteShop(item.id);
          setShops(shops.filter(s => s.id !== item.id));
          setError(null);
        }
      } catch (error) {
        setError('Failed to delete. Please try again.');
        console.error('Error deleting:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      setError(null);
      setSubmitting(true);

      if (currentView === 'owners') {
        await handleOwnerSave(formData);
      } else {
        await handleShopSave(formData);
      }
      
      setShowModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message ||
                          'Failed to save. Please try again.';
      setError(`Failed to save: ${errorMessage}`);
      console.error('Save error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper methods
  const handleOwnerSave = async (formData) => {
    let response;
    
    if (modalType === 'add') {
      response = await createShopOwner(formData);
      setShopOwners(prev => [...prev, response.data.shopOwner]);
    } else {
      response = await updateShopOwner(selectedShopOwner.id, formData);
      setShopOwners(prev => 
        prev.map(owner => 
          owner.id === selectedShopOwner.id ? response.data.shopOwner : owner
        )
      );
    }
  };

  const handleShopSave = async (formData) => {
    const response = modalType === 'add'
      ? await createShop(formData)
      : await updateShop(selectedShop.id, formData);

    // Refresh shops list to ensure data consistency
    if (selectedOwner) {
      await fetchShopsByOwner(selectedOwner.id);
    }
  };

  const filteredShops = selectedOwner ? shops : [];

  if (loading) {
    return <div className="mt-16 p-4">Loading...</div>;
  }

  return (
    <div className="mt-16">
      {currentView === 'owners' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shop Owners List</h1>
              <p className="text-gray-600 mt-1">Manage all shop owners in the system</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Add New
            </button>
          </div>

          <DataTable
            data={shopOwners}
            columns={ownerColumns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRowClick={handleOwnerRowClick}
            clickableRows={true}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                onClick={handleBackToOwners}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
              >
                ← Back to Shop Owners
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Shops - {selectedOwner?.shop_owner_name}
              </h1>
              <p className="text-gray-600 mt-1">Manage shops for this owner</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Add New Shop
            </button>
          </div>

          <DataTable
            data={filteredShops}
            columns={shopColumns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'add' ? 
            (currentView === 'owners' ? 'Add New Shop Owner' : 'Add New Shop') :
          modalType === 'edit' ? 
            (currentView === 'owners' ? 'Edit Shop Owner' : 'Edit Shop') : 
            (currentView === 'owners' ? 'Shop Owner Details' : 'Shop Details')
        }
        size={modalType === 'view' ? 'large' : 'medium'}
      >
        {modalType === 'view' ? (
          currentView === 'owners' ? (
            <ShopOwnerView owner={selectedShopOwner} />
          ) : (
            <ShopView shop={selectedShop} />
          )
        ) : (
          currentView === 'owners' ? (
            <ShopOwnerForm
              owner={selectedShopOwner}
              onSave={handleSave}
              onCancel={() => setShowModal(false)}
              isEditing={modalType === 'edit'}
              submitting={submitting}
            />
          ) : (
            <ShopForm
              shop={selectedShop}
              onSave={handleSave}
              onCancel={() => setShowModal(false)}
              isEditing={modalType === 'edit'}
              selectedOwner={selectedOwner}
              submitting={submitting}
            />
          )
        )}
      </Modal>
    </div>
  );
};

export default ManageShopOwners;