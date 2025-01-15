import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShopOwnerProfile.css';

const ShopOwnerProfile = ({ user }) => {
  const [shopOwnerDetails, setShopOwnerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopOwnerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/shopOwners/${user.id}`);
        setShopOwnerDetails(response.data);
        setFormData(response.data); // Pre-fill form for editing
        setLoading(false);
      } catch (err) {
        setError('Failed to load shop owner details. Please try again later.');
        setLoading(false);
      }
    };

    if (user && user.role === 'SHOP_OWNER') {
      fetchShopOwnerDetails();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/shopOwners/${user.id}`, formData);
      setShopOwnerDetails(response.data); // Update details with server response
      setEditing(false); // Exit editing mode
      alert('Profile updated successfully.');
    } catch (err) {
      alert('Failed to update profile. Please try again later.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your profile?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/shopOwners/${user.id}`);
        alert('Profile deleted successfully.');
        navigate('/'); // Redirect to home page after deletion
      } catch (err) {
        alert('Failed to delete profile. Please try again later.');
      }
    }
  };
  const handleCreateShop = () => {
    navigate(`/createShop/${user.id}`);
  }
  const handleViewShop = () => {
    if (shopOwnerDetails && shopOwnerDetails.id) {
      navigate(`/shopProfile/${shopOwnerDetails.id}`); 
    } else {
      alert("Shop details are unavailable.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="shop-owner-profile">
      <div className="shop-owner-container">
        <h2>Shop Owner Profile</h2>
        {shopOwnerDetails ? (
          editing ? (
            <div className="edit-form">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                NIC:
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Contact Number:
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Shop Details:
                <textarea
                  name="shopDetails"
                  value={formData.shopDetails}
                  onChange={handleInputChange}
                />
              </label>
              <div className="shop-owner-actions">
                <button onClick={handleSave} className="save-button">
                  Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="shop-owner-details">
              <p><strong>Name:</strong> {shopOwnerDetails.name}</p>
              <p><strong>Email:</strong> {shopOwnerDetails.email}</p>
              <p><strong>NIC:</strong> {shopOwnerDetails.nic}</p>
              <p><strong>Contact Number:</strong> {shopOwnerDetails.contactNumber}</p>
              <p><strong>Shop Details:</strong> {shopOwnerDetails.shopDetails || 'No details available.'}</p>
              <div className="shop-owner-actions">
                <button onClick={() => setEditing(true)} className="edit-button">
                  Update Profile
                </button>
                <button onClick={handleCreateShop} className="create-shop">
                  CreateShop
                </button>
                <button onClick={handleViewShop} className="create-shop">
                  ViewShop
                </button>
                  <button onClick={handleDelete} className="delete-button">
                    Delete Profile
                  </button>
              </div>
            </div>
          )
        ) : (
          <p>No details available.</p>
        )}
      </div>
    </div>
  );
};

export default ShopOwnerProfile;
