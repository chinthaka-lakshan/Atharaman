import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import GuideForm from '../components/forms/GuideForm';
import GuideView from '../components/views/GuideView';
import {
  getGuides,
  createGuide,
  updateGuide,
  deleteGuide
} from '../../services/api';

const ManageGuides = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch guides on component mount
  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await getGuides();
      setGuides(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch guides. Please try again.');
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'guide_name', label: 'Guide Name', sortable: true },
    { key: 'guide_nic', label: 'NIC', sortable: true },
    { key: 'business_mail', label: 'Email', sortable: true },
    { key: 'contact_number', label: 'Contact', sortable: true },
    { key: 'guide_address', label: 'Address', sortable: true },
  ];

  const handleAdd = () => {
    setModalType('add');
    setSelectedGuide(null);
    setShowModal(true);
  };

  const handleView = (guide) => {
    setModalType('view');
    setSelectedGuide(guide);
    setShowModal(true);
  };

  const handleEdit = (guide) => {
    setModalType('edit');
    setSelectedGuide(guide);
    setShowModal(true);
  };

  const handleDelete = async (guide) => {
    if (window.confirm(`Are you sure you want to delete "${guide.guide_name}"?`)) {
      try {
        setLoading(true);
        await deleteGuide(guide.id);
        setGuides(guides.filter(g => g.id !== guide.id));
      } catch (error) {
        console.error('Error deleting guide:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modalType === 'add') {
        const response = await createGuide(formData);
        setGuides([...guides, response.data.guide]);
      } else if (modalType === 'edit') {
        const response = await updateGuide(selectedGuide.id, formData);
        
        if (response.status === 200) {
          setGuides(guides.map(g => 
            g.id === selectedGuide.id ? response.data.guide : g
          ));
        }
      }
      setShowModal(false);
      setError(null);
    } catch (error) {
      console.error('Error saving guide:', error);
    }
  };

  if (loading) {
    return <div className="mt-16 p-4">Loading guides...</div>;
  }

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guides List</h1>
          <p className="text-gray-600 mt-1">Manage all tour guides in the system</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Add New
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <DataTable
        data={guides}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'add' ? 'Add New Guide' :
          modalType === 'edit' ? 'Edit Guide' : 'Guide Details'
        }
        size={modalType === 'view' ? 'large' : 'medium'}
      >
        {modalType === 'view' ? (
          <GuideView guide={selectedGuide} />
        ) : (
          <GuideForm
            guide={selectedGuide}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
            isEditing={modalType === 'edit'}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManageGuides;