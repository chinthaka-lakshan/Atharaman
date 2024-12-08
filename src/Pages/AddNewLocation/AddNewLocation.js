import React, { useState } from 'react';
import './AddNewLocation.css';
import axios from 'axios';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import { DriveFolderUploadOutlined, Close } from '@mui/icons-material';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';

const AddNewLocation = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);

  const provinces = ['Central', 'Western', 'Uva', 'North', 'Southern', 'Eastern'];

  const handleImageChange = (setImage, e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (file && !allowedTypes.includes(file.type)) {
      alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
      return;
    }
    setImage(file ? file : null); // Store the file object for uploading
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('location', e.target.locationName.value);
    formData.append('shortDescription', e.target.locationShortDescription.value);
    formData.append('longDescription', e.target.locationLongDescription.value);
    formData.append('province', e.target.province.value);

    if (image1) formData.append('mainImage', image1);
    [image2, image3, image4, image5].forEach((img, idx) => {
      if (img) formData.append('extraImage', img);
    });

    try {
      const response = await axios.post('http://localhost:8080/atharaman', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Location added:', response.data);
      alert('Location added successfully!');

      // Reset form and images
      e.target.reset();
      setImage1(null);
      setImage2(null);
      setImage3(null);
      setImage4(null);
      setImage5(null);
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Failed to add location. Please try again.');
    }
  };

  return (
    <div className="addNewLocation">
      <AdminSidebar />
      <div className="addNewLocationContainer">
        <AdminNavbar />
        <div className="top">
          <h1>ADD NEW LOCATION</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <div className="imageGrid">
              {[image1, image2, image3, image4, image5].map((src, index) => (
                <div key={index} className="imageContainer">
                  {src ? (
                    <div className="imageWrapper">
                      <img
                        src={URL.createObjectURL(src)}
                        alt={`Preview ${index + 1}`}
                        className="imagePreview"
                      />
                      <Close
                        className="removeIcon"
                        onClick={() => {
                          switch (index) {
                            case 0:
                              setImage1(null);
                              break;
                            case 1:
                              setImage2(null);
                              break;
                            case 2:
                              setImage3(null);
                              break;
                            case 3:
                              setImage4(null);
                              break;
                            case 4:
                              setImage5(null);
                              break;
                            default:
                              break;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <LocationOnSharpIcon className="placeholder" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="uploadButtons">
                {['Main Image', 'Image 2', 'Image 3', 'Image 4', 'Image 5'].map((label, index) => (
                  <div key={index} className="formInput">
                    <label htmlFor={`fileInput${index}`} className="fileUploadLabel">
                      <DriveFolderUploadOutlined className="uploadIcon" />
                      <span>{label}</span>
                    </label>
                    <input
                      type="file"
                      id={`fileInput${index}`}
                      onChange={(e) =>
                        handleImageChange(
                          [setImage1, setImage2, setImage3, setImage4, setImage5][index],
                          e
                        )
                      }
                      style={{ display: 'none' }}
                    />
                  </div>
                ))}
              </div>
              <div className="inputFields">
                <div className="formInput">
                  <label>Location Name</label>
                  <input
                    type="text"
                    name="locationName"
                    placeholder="Enter Location Name"
                    required
                  />
                </div>
                <div className="formInput">
                  <label>Short Description</label>
                  <input
                    type="text"
                    name="locationShortDescription"
                    placeholder="Enter Short Description"
                    required
                  />
                </div>
                <div className="formInput">
                  <label>Long Description</label>
                  <textarea
                    name="locationLongDescription"
                    placeholder="Enter Long Description"
                    required
                  />
                </div>
                <div className="formInput">
                  <label>Province</label>
                  <select name="province" required>
                    {provinces.map((province, index) => (
                      <option key={index} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewLocation;
