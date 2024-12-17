import React, { useState } from 'react';
import './RequestForms.css';

const ShopOwnerRequestForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name:'',
    nic: '',
    email: '',
    contactNumber: '',
    description: '',
    shopCategories: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedCategories = checked
        ? [...prevData.shopCategories, value]
        : prevData.shopCategories.filter((category) => category !== value);
      return { ...prevData, shopCategories: updatedCategories };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const shopCategoryOptions = [
    'Grocery',
    'Clothing',
    'Electronics',
    'Books',
    'Home Goods',
    'Beauty Products',
    'Sports Equipment',
  ];

  return (
    <form onSubmit={handleSubmit} className="guide-request-form">
      <h3 className="form-title">Shop Owner Request Form</h3>



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

      <div className="form-group">
        <label>Shop Categories:</label>
        <div className="checkbox-group">
          {shopCategoryOptions.map((category) => (
            <div key={category} className="checkbox-item">
              <input
                type="checkbox"
                id={category}
                name="shopCategories"
                value={category}
                checked={formData.shopCategories.includes(category)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-submit">Submit</button>
        <button type="button" onClick={onCancel} className="btn btn-cancel">Cancel</button>
      </div>
    </form>
  );
};

export default ShopOwnerRequestForm;