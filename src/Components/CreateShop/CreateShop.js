import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateShop.css";
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';

const CreateShop = () => {
  const navigate = useNavigate();

  const provinces = [
    "Central",
    "Eastern",
    "Northern",
    "North Central",
    "North Western",
    "Sabaragamuwa",
    "Southern",
    "Uva",
    "Western",
  ];

  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    description: "",
    contact: "",
    address: "",
    province: "",
    itemList: [],
  });

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedUser?.id;
  const token = loggedUser?.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      owner: formData.owner,
      description: formData.description,
      contact: formData.contact,
      address: formData.address,
      province: formData.province,
      itemList: formData.itemList,
      userId: userId,
    };

    if (!userId) {
      alert("User not logged in. Please log in to create a shop.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/Shops/add", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
      });
      alert("Shop created successfully!");
      navigate(`/shopProfile/${response.data.id}`);
    } catch (error) {
      console.error("Error creating shop:", error);
      alert("Failed to create the shop. Please try again.");
    }
  };

  return (
    <div className="createShop">
      <div className="create-shop-container">
        <div className="top">
          <h1>Create Your Shop</h1>
          <div className="imageGallery">
            <ShoppingCartSharpIcon className='img'/>
          </div>
          <form className="sForm" onSubmit={handleSubmit}>
            <div className="formDetails">
              <div className="formInput">
                <label>Shop Name:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Shop Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Shop Owner Name:</label>
                <input
                  type="text"
                  name="owner"
                  placeholder="Enter Shop Owner's Name"
                  value={formData.owner}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Description:</label>
                <textarea
                  name="description"
                  placeholder="Enter Shop Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Contact No:</label>
                <input
                  type="text"
                  name="contact"
                  placeholder="Enter Contact No"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter Shop Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="formGroup">
              <label htmlFor="province">Province:</label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select The Province
                </option>
                {provinces.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="create-shop-button">
              Create Shop
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShop;