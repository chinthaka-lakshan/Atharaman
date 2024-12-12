// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "./ItemForm.css";

// const ItemForm = () => {
//   const { id } = useParams(); // Get item ID from the URL
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     contact: "",
//     location: "",
//     description: "",
//     image: null,
//   });
//   const [file, setFile] = useState(null); // To store the uploaded file

//   // Fetch item data for editing if ID exists
//   useEffect(() => {
//     if (id) {
//       axios
//         .get(`http://localhost:8080/item/find-by-id/${id}`)
//         .then((response) => {
//           const item = response.data;
//           setFormData({
//             name: item.name,
//             price: item.price,
//             contact: item.contact,
//             location: item.location,
//             description: item.description,
//             image: item.image || null,
//           });
//         })
//         .catch((error) => {
//           console.error("Error fetching item:", error);
//           alert("Failed to fetch item data.");
//         });
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFile(file); // Store file for form submission
//       setFormData({ ...formData, image: URL.createObjectURL(file) });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Prepare the FormData object
//     const formData = new FormData();
//     formData.append("name", formData.name);
//     formData.append("price", formData.price);
//     formData.append("contact", formData.contact);
//     formData.append("location", formData.location);
//     formData.append("description", formData.description);

//     // Add image file if it exists
//     // if (file) {
//     //   formData.append("image", file);
//     // }

//     try {
//       if (id) {
//         // Update item (you may need a different endpoint for updates with FormData)
//         await axios.put("http://localhost:8080/item/update", formData,file, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Item updated successfully!");
//       } else {
//         // Add new item
//         console.log(formData);

//         await axios.post("http://localhost:8080/item/add", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Item added successfully!");
//       }
//       navigate("/items");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Failed to save the item. Please try again.");
//     }
//   };

//   return (
//     <div className="item-form-container">
//       <h2>{id ? "Edit Item" : "Add Item"}</h2>
//       <form className="item-form" onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Item Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="price"
//           type="number"
//           placeholder="Price"
//           value={formData.price}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="contact"
//           placeholder="Contact"
//           value={formData.contact}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="location"
//           placeholder="Location"
//           value={formData.location}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//         {formData.image && (
//           <img src={formData.image} alt="Preview" className="image-preview" />
//         )}
//         <button type="submit">{id ? "Update Item" : "Add Item"}</button>
//       </form>
//     </div>
//   );
// };

// export default ItemForm;

//-----------------------------------
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
    <div className="item-form-container">
      <h2>Add Item</h2>
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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ItemForm;

//------------------new----------
// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "./ItemForm.css";

// const ItemForm = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Get shopId from route params
//   const [formData, setFormData] = useState({
//     //shopId: id || 0, // Ensure shopId is provided
//     name: "",
//     price: "",
//     contact: "",
//     location: "",
//     description: "",
//   });
//   const [file, setFile] = useState(null); // Store uploaded file
//   const [preview, setPreview] = useState(null); // Image preview URL

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     Object.keys(formData).forEach((key) => {
//       data.append(key, formData[key]);
//     });
//     if (file) {
//       data.append("image", file); // Append the image file
//     }

//     // Debug: Inspect FormData
//     console.log("Submitting FormData:");
//     for (let [key, value] of data.entries()) {
//       console.log(key, value);
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/item/add",
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       console.log(data, "sasa");

//       if (response.status === 200 || response.status === 201) {
//         alert("Item added successfully!");
//         //navigate(`/ShopProfile/${id}`); // Redirect to shop page
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Failed to save the item. Please try again.");
//     }
//   };

//   return (
//     <div className="item-form-container">
//       <h2>Add Item</h2>
//       <form className="item-form" onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Item Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="price"
//           type="number"
//           placeholder="Price"
//           value={formData.price}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="contact"
//           placeholder="Contact"
//           value={formData.contact}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="location"
//           placeholder="Location"
//           value={formData.location}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           required
//         />
//         {preview && (
//           <img src={preview} alt="Preview" className="image-preview" />
//         )}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default ItemForm;
