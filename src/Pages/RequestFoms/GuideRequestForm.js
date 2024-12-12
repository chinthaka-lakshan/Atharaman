import React, { useState } from 'react';
import './RequestForms.css';

const GuideRequestForm = ({ onSubmit, onCancel, availablePlaces = ["Beach", "Mountain", "City Tour", "Forest", "Waterfall", "Historical Sites", "Adventure Park"] }) => {
  const [formData, setFormData] = useState({
    nic: '',
    email: '',
    contactNumber: '',
    description: '',
    selectedPlaces: [],
  });

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
        <label htmlFor="guideNumber">E mail:</label>
        <input
          type="text"
          id="guideNumber"
          name="guideNumber"
          value={formData.guideNumber}
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
        <label htmlFor="experience">Description:</label>
        <textarea
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="form-textarea"
          required
        />
      </div>

      <div className="form-group">
        <label>Guide Places:</label>
        <div className="checkbox-group">
          {availablePlaces && availablePlaces.length > 0 ? (
            availablePlaces.map((place) => (
              <div key={place} className="checkbox-item">
                <input
                  type="checkbox"
                  id={place}
                  name="selectedPlaces"
                  value={place}
                  onChange={handlePlaceSelection}
                />
                <label htmlFor={place}>{place}</label>
              </div>
            ))
          ) : (
            <p>No places available.</p>
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