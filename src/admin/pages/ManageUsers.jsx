import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import UserForm from '../components/forms/UserForm';
import UserView from '../components/views/UserView';
import {
  getUsers,
  registerAdmin,
  updateAdmin,
  deleteAdmin
} from '../../services/api';

const ManageUsers = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modalType === 'add') {
        await registerAdmin(formData);
        alert('Admin registered successfully!');
      } else if (modalType === 'edit') {
        await updateAdmin(selectedUser.id, formData);
        alert('User updated successfully!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete "${user.name}"?`)) {
      try {
        await deleteAdmin(user.id);
        setUsers(users.filter(u => u.id !== user.id));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const columns = [
    { key: 'id', label: 'User ID', sortable: true },
    { key: 'name', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  const handleAdd = () => {
    setModalType('add');
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleView = (user) => {
    setModalType('view');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalType('edit');
    setSelectedUser(user);
    setShowModal(true);
  };
  
  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administrators</h1>
          <p className="text-gray-600 mt-1">Manage all Admins of the system</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Add New
        </button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'add' ? 'Add New User' :
          modalType === 'edit' ? 'Edit User' : 'User Details'
        }
        size={modalType === 'view' ? 'large' : 'medium'}
      >
        {modalType === 'view' ? (
          <UserView user={selectedUser} />
        ) : (
          <UserForm
            user={selectedUser}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;