import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateShop.css";

const CreateShop = () => {
  const navigate = useNavigate();

  // List of provinces
  const provinces = [
    "Western",
    "Central",
    "North-Western",
    "Sabaragamuwa",
    "Uva",
    "North",
    "North-Central",
    "Southern",
    "Eastern",
  ];

  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    description: "",
    contact: "",
    location: "",
    province: "", // Added province field
    photo: null,
    itemList: [], // Default as an empty array
  });

  const [preview, setPreview] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedUser?.id;
  const token = loggedUser?.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send to the backend
    const data = {
      name: formData.name,
      owner: formData.owner,
      description: formData.description,
      contact: formData.contact,
      location: formData.location,
      province: formData.province, // Include province in the submitted data
      image: formData.photo || null, // Include photo if exists, otherwise null
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
    <div className="create-shop-container">
      <h2>Create Shop</h2>
      <form className="create-shop-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Shop Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="owner"
          placeholder="Owner Name"
          value={formData.owner}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
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
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {preview && (
          <img src={preview} alt="Preview" className="photo-preview" />
        )}
        <button type="submit" className="btn-create">
          Create Shop
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
