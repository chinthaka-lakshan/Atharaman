import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShopOwnerProfile.css';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

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
        setFormData(response.data);
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
      setShopOwnerDetails(response.data);
      setEditing(false);
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
        navigate('/');
      } catch (err) {
        alert('Failed to delete profile. Please try again later.');
      }
    }
  };

  const handleCreateShop = () => {
    navigate(`/createShop/${user.id}`);
  };

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
      <div className="shop-owner-profile-container">
        {shopOwnerDetails ? (
          <>
            <div className="top">
              <h1>Shop Owner Profile</h1>
              <div className="imageGallery">
                <AccountBoxIcon className='img'/>
              </div>
              <div className="shop-owner-details">
                <p><strong>Name:</strong> {shopOwnerDetails.name}</p>
                <p><strong>Email:</strong> {shopOwnerDetails.email}</p>
                <p><strong>NIC:</strong> {shopOwnerDetails.nic}</p>
                <p><strong>Contact Number:</strong> {shopOwnerDetails.contactNumber}</p>
                <p><strong>Description:</strong> {shopOwnerDetails.description}</p>
              </div>
              <div className="shop-owner-actions">
                <button onClick={() => setEditing(true)} className="edit-button">
                  Update Profile
                </button>
                <button onClick={handleCreateShop} className="create-shop-button">
                  CreateShop
                </button>
                <button onClick={handleViewShop} className="view-shop-button">
                  ViewShop
                </button>
                <button onClick={handleDelete} className="delete-button">
                  Delete Profile
                </button>
              </div>
            </div>
            {editing && (
              <div className="bottom">
                <h1>Edit Shop Owner Profile</h1>
                <form className="eForm">
                  <div className="formDetails">
                    <div className="editFormInput">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="editFormInput">
                      <label>Description:</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="editFormInput">
                      <label>E-Mail:</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="editFormInput">
                      <label>NIC:</label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleInputChange}
                        placeholder="NIC"
                      />
                    </div>
                    <div className="editFormInput">
                      <label>Contact No:</label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Contact Number"
                      />
                    </div>
                  </div>
                  <div className="buttons">
                    <button type="button" className="saveButton" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button type="button" className="cancelButton" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <p>No details available.</p>
        )}
      </div>
    </div>
  );
};

export default ShopOwnerProfile;