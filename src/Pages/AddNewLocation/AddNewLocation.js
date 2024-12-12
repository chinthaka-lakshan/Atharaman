import React, { useState } from 'react';
import './AddNewLocation.css';
import axios from 'axios';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import { DriveFolderUploadOutlined, Close } from '@mui/icons-material';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const AddNewLocation = () => {
  const [image1, setImage1] = useState(null);
  const [extraImages, setExtraImages] = useState([null, null, null, null]);
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  const provinces = ['Central', 'Western', 'Uva', 'North', 'Southern', 'Eastern'];

  const handleImageChange = (setter, index, e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (file && !allowedTypes.includes(file.type)) {
      alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
      return;
    }

    if (index === -1) {
      setter(file ? file : null); // Main image
    } else {
      const updatedImages = [...extraImages];
      updatedImages[index] = file ? file : null; // Extra images
      setExtraImages(updatedImages);
    }
  };

  const handleLocationSelect = async (place) => {
    setLocation(place);

    const geocodeApiKey = 'AIzaSyBnoSZiGiahM3iiUAGCFyDyWj73vl_INjk';

    try {
      const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place.value.place_id}&key=${geocodeApiKey}`);
      const geocodeData = await geocodeResponse.json();
      if (geocodeData.results && geocodeData.results[0]) {
        const { lat, lng } = geocodeData.results[0].geometry.location;
        setCoordinates({ lat, lng });
      } else {
        alert('Unable to fetch coordinates for the selected location.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('location', e.target.locationName.value);
    formData.append('shortDescription', e.target.locationShortDescription.value);
    formData.append('longDescription', e.target.locationLongDescription.value);
    formData.append('province', e.target.province.value);

    if (location) {
      formData.append('place', location.label);
      if (coordinates) {
        formData.append('latitude', coordinates.lat);
        formData.append('longitude', coordinates.lng);
      }
    }

    if (image1) formData.append('mainImage', image1);
    extraImages.forEach((img, idx) => {
      if (img) formData.append(`extraImage${idx + 1}`, img);
    });

    try {
      const response = await axios.post('http://localhost:8080/locations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Location added:', response.data);
      alert('Location added successfully!');
      e.target.reset();
      setImage1(null);
      setExtraImages([null, null, null, null]);
      setLocation(null);
      setCoordinates(null);
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
          <div className="images">
            <div className="imageGrid">
              {[image1, ...extraImages].map((src, index) => (
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
                          if (index === 0) {
                            setImage1(null);
                          } else {
                            const updatedImages = [...extraImages];
                            updatedImages[index - 1] = null;
                            setExtraImages(updatedImages);
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
          <div className="form">
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
                          index === 0 ? setImage1 : null,
                          index === 0 ? -1 : index - 1,
                          e
                        )
                      }
                      style={{ display: 'none' }}
                    />
                  </div>
                ))}
              </div>
              <div className="inputFields">
                <div className="selectLocation">
                  <label>Search Location</label>
                  <GooglePlacesAutocomplete
                    apiKey="AIzaSyBnoSZiGiahM3iiUAGCFyDyWj73vl_INjk"
                    selectProps={{
                      onChange: handleLocationSelect,
                    }}
                  />
                  {location && coordinates && (
                    <p>
                      Selected Place: {location.label} ({coordinates.lat}, {coordinates.lng})
                    </p>
                  )}
                </div>
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
                  <label>Province</label>
                  <select name="province" required>
                    {provinces.map((province, index) => (
                      <option key={index} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
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