import React, { useEffect, useState } from "react";
import './RequestForms.css';

const GuideRequestForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    email: '',
    contactNumber: '',
    description: '',
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="guide-request-form">
      <h3 className="form-title">Guide Request Form</h3>

      {/* Other Input Fields */}
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







      
      {/* Add fields for NIC, email, etc. */}

      {/* Place Selection */}
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

      <div className="form-actions">
        <button type="submit" className="btn btn-submit">Submit</button>
        <button type="button" onClick={onCancel} className="btn btn-cancel">Cancel</button>
      </div>
    </form>
  );
};

export default GuideRequestForm;
