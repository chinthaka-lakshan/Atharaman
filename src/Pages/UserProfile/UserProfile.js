import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUser, submitRequest } from '../../services/Api';
import './UserProfile.css'; // Import CSS file

const UserProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [currentForm, setCurrentForm] = useState(null);
  const [requestDetails, setRequestDetails] = useState({
    birthday: '',
    number: '',
    contactNumber: '',
    experience: '',
  });
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then(({ data }) => {
        setProfile(data);
        setEditForm({ username: data.username, email: data.email });
        if (data.requestStatus === 'PENDING') {
          setHasPendingRequest(true);
        }
      });
    }
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateUser(user.id, editForm);
      setProfile(data);
      alert('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user: { id: user.id },
        type: currentForm,
        status: 'PENDING',
        birthday: requestDetails.birthday,
        number: requestDetails.number,
        contactNumber: requestDetails.contactNumber,
        experience: requestDetails.experience,
      };

      const { data } = await submitRequest(payload);
      alert(`Request for ${currentForm} submitted successfully. Please wait for admin approval.`);
      setHasPendingRequest(true);
      setCurrentForm(null);
      setRequestDetails({
        birthday: '',
        number: '',
        contactNumber: '',
        experience: '',
      });
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Failed to submit request.');
    }
  };

  if (!profile) return <p className="user-loading-text">Loading...</p>;

  return (
   <div className="user-page">
        <div className="user-profile-container">
        <h1 className="user-welcome-message">Welcome, {profile.username}</h1>
        <div className="user-profile-details">
            <p>Email: <span>{profile.email}</span></p>
            <p>Role: <span>{profile.role || 'USER'}</span></p>
        </div>

        <div className="user-edit-profile-section">
            <h2>Edit Profile</h2>
            {isEditing ? (
            <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="user-form-group">
                <label>Username:</label>
                <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    required
                />
                </div>
                <div className="user-form-group">
                <label>Email:</label>
                <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                />
                </div>
                <div className="user-form-actions">
                <button type="submit" className="btn user-save-btn">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn user-cancel-btn">Cancel</button>
                </div>
            </form>
            ) : (
            <button onClick={() => setIsEditing(true)} className="user-btn edit-btn">Edit Profile</button>
            )}
        </div>

        <div className="user-requests-section">
            <h2>Requests</h2>
            {hasPendingRequest ? (
            <p className="user-user-pending-message">You have a pending request. Please wait for admin approval.</p>
            ) : (
            <>
                <button onClick={() => setCurrentForm('GUIDE')} className="btn request-btn">Request to Become a Guide</button>
                <button onClick={() => setCurrentForm('SHOP_OWNER')} className="btn request-btn">Request to Become a Shop Owner</button>
            </>
            )}
        </div>

        {currentForm && (
            <form onSubmit={handleSubmitRequest} className="request-form">
            <h3>{currentForm === 'GUIDE' ? 'Guide Request Form' : 'Shop Owner Request Form'}</h3>
            <div className="user-form-group">
                <label>Birthday:</label>
                <input
                type="date"
                value={requestDetails.birthday}
                onChange={(e) => setRequestDetails({ ...requestDetails, birthday: e.target.value })}
                required
                />
            </div>
            <div className="user-form-group">
                <label>{currentForm === 'GUIDE' ? 'Guide Number:' : 'Shop Number:'}</label>
                <input
                type="text"
                value={requestDetails.number}
                onChange={(e) => setRequestDetails({ ...requestDetails, number: e.target.value })}
                required
                />
            </div>
            <div className="user-form-group">
                <label>Contact Number:</label>
                <input
                type="text"
                value={requestDetails.contactNumber}
                onChange={(e) => setRequestDetails({ ...requestDetails, contactNumber: e.target.value })}
                required
                />
            </div>
            <div className="user-form-group">
                <label>Experience:</label>
                <textarea
                value={requestDetails.experience}
                onChange={(e) => setRequestDetails({ ...requestDetails, experience: e.target.value })}
                required
                placeholder="Describe your experience..."
                />
            </div>
            <div className="user-form-actions">
                <button type="submit" className="btn submit-btn">Submit Request</button>
                <button
                type="button"
                onClick={() => {
                    setCurrentForm(null);
                    setRequestDetails({
                    birthday: '',
                    number: '',
                    contactNumber: '',
                    experience: '',
                    });
                }}
                className="user-btn cancel-btn"
                >
                Cancel
                </button>
            </div>
            </form>
        )}
        </div>
    </div>
  );
};

export default UserProfile;
