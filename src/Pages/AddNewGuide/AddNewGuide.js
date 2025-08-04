import React, { useState } from 'react';
import './AddNewGuide.css';
import axios from 'axios';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import { DriveFolderUploadOutlined, Close } from '@mui/icons-material';

const AddNewGuide = () => {
  const [guideImage, setGuideImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (file && !allowedTypes.includes(file.type)) {
      alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
      return;
    }
    setGuideImage(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('guideName', e.target.guideName.value);
    formData.append('businessMail', e.target.businessMail.value);
    formData.append('personalNumber', e.target.personalNumber.value);
    formData.append('whatsappNumber', e.target.whatsappNumber.value);
    formData.append('description', e.target.description.value);
    formData.append('location', e.target.location.value);
    formData.append('languages', e.target.languages.value); // Comma-separated string
    formData.append('user_id', e.target.userId.value); // Assuming user selection or manual entry

    if (guideImage) {
      formData.append('guideImage', guideImage);
    }

    try {
      const token = 'YOUR_ACCESS_TOKEN'; // Replace with actual token if needed
      const response = await axios.post('http://localhost:8080/api/guides', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Guide added:', response.data);
      setSuccess('Guide added successfully!');
      e.target.reset();
      setGuideImage(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to add guide. Please check your inputs.');
    }
  };

  return (
    <div className="addNewGuide">
      <AdminSidebar />
      <div className="addNewGuideContainer">
        <AdminNavbar />
        <div className="top">
          <h1>ADD NEW GUIDE</h1>
        </div>
        <div className="bottom">
          <div className="images">
            <div className="imageGrid">
              {guideImage ? (
                <div className="imageWrapper">
                  <img src={URL.createObjectURL(guideImage)} alt="Guide Preview" className="ImagePreview" />
                  <Close className="removeIcon" onClick={() => setGuideImage(null)} />
                </div>
              ) : (
                <div className="placeholderImage">No Image</div>
              )}
              <div className="uploadButton">
                <label htmlFor="guideImageUpload" className="fileUploadLabel">
                  <DriveFolderUploadOutlined className="uploadIcon" />
                  <span>Upload Guide Image</span>
                </label>
                <input
                  type="file"
                  id="guideImageUpload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          <div className="form">
            <div className="inputFields">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Guide Name</label>
                <input type="text" name="guideName" placeholder="Enter full name" required />
              </div>
              <div className="formInput">
                <label>Business Email</label>
                <input type="email" name="businessMail" placeholder="Enter business email" required />
              </div>
              <div className="formInput">
                <label>Personal Phone Number</label>
                <input type="text" name="personalNumber" placeholder="Enter personal number" required />
              </div>
              <div className="formInput">
                <label>WhatsApp Number</label>
                <input type="text" name="whatsappNumber" placeholder="Enter WhatsApp number" required />
              </div>
              <div className="formInput">
                <label>Languages (comma-separated)</label>
                <input type="text" name="languages" placeholder="e.g., English, Sinhala, Tamil" required />
              </div>
              <div className="formInput">
                <label>Location</label>
                <input type="text" name="location" placeholder="Enter guide location" required />
              </div>
              <div className="formInput">
                <label>Description</label>
                <textarea name="description" placeholder="Enter guide description" required />
              </div>
              <div className="formInput">
                <label>User ID</label>
                <input type="number" name="userId" placeholder="Enter associated user ID" required />
              </div>
              {error && <p className="errorMessage">{error}</p>}
              {success && <p className="successMessage">{success}</p>}
              <button type="submit">Add Guide</button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewGuide;
