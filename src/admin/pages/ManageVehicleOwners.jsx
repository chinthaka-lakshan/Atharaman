import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import VehicleOwnerForm from '../components/forms/VehicleOwnerForm';
import VehicleForm from '../components/forms/VehicleForm';
import VehicleOwnerView from '../components/views/VehicleOwnerView';
import VehicleView from '../components/views/VehicleView';
import {
  getVehicleOwners,
  getVehicleOwnerById,
  createVehicleOwner,
  updateVehicleOwner,
  deleteVehicleOwner,
  getVehiclesByOwner,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../../services/api';

const ManageVehicleOwners = () => {
  const [currentView, setCurrentView] = useState('owners'); // 'owners' or 'shops'
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedVehicleOwner, setSelectedVehicleOwner] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleOwners, setVehicleOwners] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vehicle owners on component mount
  useEffect(() => {
    fetchVehicleOwners();
  }, []);

  const fetchVehicleOwners = async () => {
    setLoading(true);
    try {
      const response = await getVehicleOwners();
      setVehicleOwners(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch vehicle owners. Please try again.');
      console.error('Error fetching vehicle owners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles when selected owner changes
  useEffect(() => {
    if (selectedOwner) {
      fetchVehiclesByOwner(selectedOwner.id);
    }
  }, [selectedOwner]);

  const fetchVehiclesByOwner = async (ownerId) => {
    setLoading(true);
    try {
      const response = await getVehiclesByOwner(ownerId);
      setVehicles(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch vehicles. Please try again.');
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const ownerColumns = [
    { key: 'vehicle_owner_name', label: 'Vehicle Owner Name', sortable: true },
    { key: 'vehicle_owner_nic', label: 'NIC', sortable: true },
    { key: 'business_mail', label: 'Email', sortable: true },
    { key: 'contact_number', label: 'Phone', sortable: true },
  ];

  const vehicleColumns = [
    { key: 'vehicle_name', label: 'Make & Model', sortable: true },
    { key: 'vehicle_type', label: 'Type', sortable: true },
    { key: 'reg_number', label: 'Reg No', sortable: true },
    { key: 'no_of_passengers', label: 'Passengers', sortable: true },
    { key: 'fuel_type', label: 'Fuel', sortable: true },
    { key: 'driver_status', label: 'Driver Status', sortable: true },
  ];

  const handleOwnerRowClick = (owner) => {
    setSelectedOwner(owner);
    setCurrentView('vehicles');
  };

  const handleBackToOwners = () => {
    setCurrentView('owners');
    setSelectedOwner(null);
    setSelectedVehicle(null);
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedVehicleOwner(null)
    setSelectedVehicle(null);
    setShowModal(true);
  };

const handleView = async (item) => {
    try {
      if (currentView === 'owners') {
        const response = await getVehicleOwnerById(item.id);
        setModalType('view');
        setSelectedVehicleOwner(response.data);
        setShowModal(true);
      } else {
        const response = await getVehicleById(item.id);
        setModalType('view');
        setSelectedVehicle(response.data);
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
      setSelectedVehicleOwner(item);
      setSelectedVehicle(null);
    } else {
      setSelectedVehicle(item);
      setSelectedVehicleOwner(null);
    }
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    const itemName = currentView === 'owners' ? item.vehicle_owner_name : item.vehicleName;
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        setLoading(true);
        if (currentView === 'owners') {
          await deleteVehicleOwner(item.id);
          setVehicleOwners(vehicleOwners.filter(o => o.id !== item.id));
          setError(null);
        } else {
          await deleteVehicle(item.id);
          setVehicles(vehicles.filter(v => v.id !== item.id));
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
        await handleVehicleSave(formData);
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
      response = await createVehicleOwner(formData);
      setVehicleOwners(prev => [...prev, response.data.vehicleOwner]);
    } else {
      response = await updateVehicleOwner(selectedVehicleOwner.id, formData);
      setVehicleOwners(prev => 
        prev.map(owner => 
          owner.id === selectedVehicleOwner.id ? response.data.vehicleOwner : owner
        )
      );
    }
  };

  const handleVehicleSave = async (formData) => {
    const response = modalType === 'add'
      ? await createVehicle(formData)
      : await updateVehicle(selectedVehicle.id, formData);

    // Refresh vehicles list to ensure data consistency
    if (selectedOwner) {
      await fetchVehiclesByOwner(selectedOwner.id);
    }
  };

  const filteredVehicles = selectedOwner ? vehicles : [];

  if (loading) {
    return <div className="mt-16 p-4">Loading...</div>;
  }

  return (
    <div className="mt-16">
      {currentView === 'owners' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vehicle Owners List</h1>
              <p className="text-gray-600 mt-1">Manage all vehicle owners in the system</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Add New
            </button>
          </div>

          <DataTable
            data={vehicleOwners}
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
                ← Back to Vehicle Owners
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Vehicles - {selectedOwner?.vehicle_owner_name}
              </h1>
              <p className="text-gray-600 mt-1">Manage vehicles for this owner</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Add New Vehicle
            </button>
          </div>

          <DataTable
            data={filteredVehicles}
            columns={vehicleColumns}
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
            (currentView === 'owners' ? 'Add New Vehicle Owner' : 'Add New Vehicle') :
          modalType === 'edit' ? 
            (currentView === 'owners' ? 'Edit Vehicle Owner' : 'Edit Vehicle') : 
            (currentView === 'owners' ? 'Vehicle Owner Details' : 'Vehicle Details')
        }
        size={modalType === 'view' ? 'large' : 'medium'}
      >
        {modalType === 'view' ? (
          currentView === 'owners' ? (
            <VehicleOwnerView owner={selectedVehicleOwner} />
          ) : (
            <VehicleView vehicle={selectedVehicle} />
          )
        ) : (
          currentView === 'owners' ? (
            <VehicleOwnerForm
              owner={selectedVehicleOwner}
              onSave={handleSave}
              onCancel={() => setShowModal(false)}
              isEditing={modalType === 'edit'}
              submitting={submitting}
            />
          ) : (
            <VehicleForm
              vehicle={selectedVehicle}
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

export default ManageVehicleOwners;