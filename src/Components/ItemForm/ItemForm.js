import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ItemForm.css";

const ItemForm = () => {
  const navigate = useNavigate();

  // Example: Get the shopId from localStorage or a context (adjust according to your logic)
  //const shopId = localStorage.getItem("shopId"); // You could replace this with context or props
  const { id } = useParams();
  const [formData, setFormData] = useState({
    shopId: id || 0, // Ensure the shopId is set correctly, fallback to 0 if not found
    name: "",
    price: "",
    contact: "",
    location: "",
    description: "",
  });
  const [file, setFile] = useState(null); // To store the uploaded file
  const [preview, setPreview] = useState(null); // To store the image preview URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("image", file);

    try {
      console.log(formData.shopId);
      console.log(data);
      const response = await axios.post(
        "http://localhost:8080/item/add",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response != null) {
        alert("Item added successfully!");
      }

      navigate(`/ShopProfile/${id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save the item. Please try again.");
    }
  };

  return (
    <div className="item-form">
      <div className="item-form-container">
        <div className="top">
          <h1>Add Item</h1>
          <form className="iForm" onSubmit={handleSubmit}>
            <div className="formDetails">
              <div className="formInput">
                <label>Item Name:</label>
                <input
                  name="name"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Price:</label>
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Contact No:</label>
                <input
                  name="contact"
                  placeholder="Contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Address:</label>
                <input
                  name="location"
                  placeholder="Address"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <label>Description:</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formInput">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {preview && (
                  <img src={preview} alt="Preview" className="image-preview" />
                )}
              </div>
            </div>
            <button type="submit" className="addItemButton">Add Item</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;