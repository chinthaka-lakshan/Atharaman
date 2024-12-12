import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ItemList.css";
import axios from "axios";

const ItemList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // Load items from the backend
  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/item/get-all");
        setItems(response.data);
      } catch (error) {
        console.error("Error loading items:", error);
      }
    };

    loadItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:8080/item/${id}`);
        setItems(items.filter((item) => item.id !== id));
        alert("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-item/${id}`);
  };

  return (
    <div className="item-list-container">
      <h1>Item List</h1>
      <button
        onClick={() => navigate("/add-item/:id")}
        className="btn-add-item"
      >
        Add Item
      </button>
      <table className="item-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Contact</th>
            <th>Location</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.image || "https://via.placeholder.com/50"}
                  alt={item.name}
                  className="item-image"
                />
              </td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.contact}</td>
              <td>{item.location}</td>
              <td>{item.description}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(item.id)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    // ------------
  );
};

export default ItemList;
