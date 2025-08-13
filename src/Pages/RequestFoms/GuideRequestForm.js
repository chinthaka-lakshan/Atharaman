import React, { useEffect, useState } from "react";
import './RequestForms.css';

const GuideRequestForm = ({ onSubmit, onCancel }) => {

  const provinces = [
    'Western',
    'Central',
    'North-Western',
    'Sabaragamuwa',
    'Uva',
    'North',
    'North-Central',
    'Southern',
    'Eastern',
  ];

  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    email: '',
    contactNumber: '',
    description: '',
    province: '',
    selectedPlaces: [],
  });

  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    // Fetch places from the API
    fetch("http://localhost:8080/locations")
      .then((response) => response.json())
      .then((data) => setAvailablePlaces(data))
      .catch((error) => console.error("Error fetching places:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceSelection = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      if (checked) {
        return { ...prevState, selectedPlaces: [...prevState.selectedPlaces, value] };
      } else {
        return {
          ...prevState,
          selectedPlaces: prevState.selectedPlaces.filter((place) => place !== value),
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataWithImages = { ...formData};
    onSubmit(formDataWithImages);
  };

  return (
    <form onSubmit={handleSubmit} className="guide-request-form">
      <h3 className="form-title">Guide Request Form</h3>

      {/* Name Field */}
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      {/* NIC Field */}
      <div className="form-group">
        <label htmlFor="nic">NIC:</label>
        <input
          type="text"
          id="nic"
          name="nic"
          value={formData.nic}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      {/* Email Field */}
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      {/* Contact Number Field */}
      <div className="form-group">
        <label htmlFor="contactNumber">Contact Number:</label>
        <input
          type="text"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      {/* Description Field */}
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          required
        />
      </div>

      {/* Province Field */}
      <div className="formInput">
        <label htmlFor="province">Province:</label>
        <select
          id="province"
          name="province"
          value={formData.province}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a province
          </option>
          {provinces.map((province, index) => (
            <option key={index} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* Guide Places Field */}
      <div className="form-group">
        <label>Guide Places:</label>
        <div className="checkbox-group">
          {availablePlaces.length > 0 ? (
            availablePlaces.map((place) => (
              <div key={place.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`place-${place.id}`}
                  name="selectedPlaces"
                  value={place.id}
                  onChange={handlePlaceSelection}
                />
                <label htmlFor={`place-${place.id}`}>{place.location}</label>
              </div>
            ))
          ) : (
            <p>Loading places...</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="submit" className="btn btn-submit">
          Submit
        </button>
        <button type="button" onClick={onCancel} className="btn btn-cancel">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default GuideRequestForm;