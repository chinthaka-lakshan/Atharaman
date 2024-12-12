import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ItemForm.css";

const ItemEditForm = () => {
  const { id } = useParams(); // Get item ID from the route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    contact: "",
    location: "",
    description: "",
    image: null,
  });
  const [file, setFile] = useState(null); // Store uploaded file
  const [preview, setPreview] = useState(null); // Image preview URL

  // Fetch item data for editing
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/item/find-by-id/${id}`)
        .then((response) => {
          const item = response.data;
          setFormData({
            name: item.name,
            price: item.price,
            contact: item.contact,
            location: item.location,
            description: item.description,
            image: null, // Reset image file input
          });
          if (item.image) {
            setPreview(`data:image/jpeg;base64,${item.image}`);
          }
        })
        .catch((error) => {
          console.error("Error fetching item data:", error);
          alert("Failed to fetch item data.");
        });
    }
  }, [id]);

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
    if (file) {
      data.append("image", file); // Append the image file
    } else {
      console.error("No image file selected!");
    }

    console.log("Submitting FormData:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.put(
        "http://localhost:8080/item/update",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        alert("Item updated successfully!");
        navigate(`/items`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save the item. Please try again.");
    }
  };

  return (
    <div className="item-form-container">
      <h2>Edit Item</h2>
      <form className="item-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ItemEditForm;
