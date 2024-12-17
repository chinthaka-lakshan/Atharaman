import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GuideProfile.css';

const GuideProfile = ({ user }) => {
  const [guideDetails, setGuideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/${user.id}`);
        setGuideDetails(response.data);
        setFormData(response.data); // Pre-fill the form for editing
        setLoading(false);
      } catch (err) {
        setError('Failed to load guide details. Please try again later.');
        setLoading(false);
      }
    };

    if (user && user.role === 'GUIDE') {
      fetchGuideDetails();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/guides/${user.id}`, formData);
      setGuideDetails(response.data); // Update details with server response
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
        await axios.delete(`http://localhost:8080/api/guides/${user.id}`);
        alert('Profile deleted successfully.');
        navigate('/'); // Redirect to home page after deletion
      } catch (err) {
        alert('Failed to delete profile. Please try again later.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
    <div className="guide-profile">
    <div className='gfb'>
          <div className="guide-profile-container">
            
            <h2>Guide Profile</h2>
            {guideDetails ? (
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
                    Description:
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Places:
                    <input
                      type="text"
                      name="places"
                      value={formData.places?.join(', ') || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          places: e.target.value.split(',').map((place) => place.trim()),
                        })
                      }
                    />
                  </label>
                    <div className="guide-actions">
                      <button onClick={handleSave} className="save-button">Save Changes</button>
                      <button onClick={() => setEditing(false)} className="cancel-button">Cancel</button>
                    </div>
                </div>
              ) : (
                <div className="guide-details">
                  <p><strong>Name:</strong> {guideDetails.name}</p>
                  <p><strong>Email:</strong> {guideDetails.email}</p>
                  <p><strong>NIC:</strong> {guideDetails.nic}</p>
                  <p><strong>Contact Number:</strong> {guideDetails.contactNumber}</p>
                  <p><strong>Description:</strong> {guideDetails.description}</p>
                  <p><strong>Places:</strong> {guideDetails.places?.join(', ') || 'No places assigned.'}</p>
                    <div className="guide-actions">
                      <button onClick={() => setEditing(true)} className="edit-button">Edit Profile</button>
                      <button onClick={handleDelete} className="delete-button">Delete Profile</button>
                    </div>
                    
                </div>
          
        )
      ) : (
        <p>No details available.</p>
      )}
    </div>
    
    </div>
    </div>
    </div>
  );
};

export default GuideProfile;
