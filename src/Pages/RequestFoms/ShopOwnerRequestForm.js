import React, { useState } from 'react';
import './RequestForms.css';

const ShopOwnerRequestForm = ({ onSubmit, onCancel }) => {
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="guide-request-form">
      <h3 className="form-title">Shop Owner Request Form</h3>

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

      {/* Province Dropdown */}
      <div className="form-group">
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

export default ShopOwnerRequestForm;
