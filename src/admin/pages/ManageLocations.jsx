import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import LocationForm from '../components/forms/LocationForm';
import LocationView from '../components/views/LocationView';
import { useAuth } from '../../contexts/AuthContext';
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
} from '../../services/api';

const ManageLocations = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  // Fetch locations from backend
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await getLocations();
      setLocations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch locations. Please try again.');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'locationName', label: 'Location Name', sortable: true },
    { key: 'locationType', label: 'Type', sortable: true },
    { 
      key: 'shortDescription', 
      label: 'Description', 
      sortable: false,
      render: (value) => (
        <div className="max-w-xl truncate" title={value}>
          {value}
        </div>
      )
    },
  ];

  const handleAdd = () => {
    setModalType('add');
    setSelectedLocation(null);
    setShowModal(true);
  };

  const handleView = (location) => {
    setModalType('view');
    setSelectedLocation(location);
    setShowModal(true);
  };

  const handleEdit = (location) => {
    setModalType('edit');
    setSelectedLocation(location);
    setShowModal(true);
  };

  const handleDelete = async (location) => {
    if (window.confirm(`Are you sure you want to delete "${location.locationName}"?`)) {
      try {
        await deleteLocation(location.id);
        setLocations(locations.filter(l => l.id !== location.id));
      } catch (err) {
        if (err.response?.status === 403) {
          setError('You do not have permission to delete locations.');
        } else {
          setError('Failed to delete location. Please try again.');
        }
        console.error('Error deleting location:', err);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modalType === 'add') {
        const response = await createLocation(formData);
        setLocations([...locations, response.data.location]);
      } else if (modalType === 'edit') {
        const response = await updateLocation(selectedLocation.id, formData);
        
        if (response.status === 200) {
          setLocations(locations.map(l => 
            l.id === selectedLocation.id ? response.data.location : l
          ));
        }
      }
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error saving location:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to modify locations.');
      } else {
        setError(`Failed to ${modalType === 'add' ? 'create' : 'update'} location. Please try again.`);
      }
    }
  };

  if (loading) {
    return <div className="mt-16 p-4">Loading locations...</div>;
  }

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations List</h1>
          <p className="text-gray-600 mt-1">Manage all tourist locations in the system</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Add New
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <DataTable
        data={locations}
        columns={columns}
        onView={handleView}
        onEdit={user?.role === 'Admin' ? handleEdit : undefined}
        onDelete={user?.role === 'Admin' ? handleDelete : undefined}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'add' ? 'Add New Location' :
          modalType === 'edit' ? 'Edit Location' : 'Location Details'
        }
        size={modalType === 'view' ? 'large' : 'medium'}
      >
        {modalType === 'view' ? (
          <LocationView location={selectedLocation} />
        ) : (
          <LocationForm
            location={selectedLocation}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManageLocations;