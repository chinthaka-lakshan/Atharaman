// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./CreateShop.css";

// const CreateShop = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     owner: "",
//     contact: "",
//     location: "",
//     photo: null,
//   });
//   const [addedShop, setAddedShop] = useState(null);
//   const [preview, setPreview] = useState(null); // For image preview

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, photo: file });
//       setPreview(URL.createObjectURL(file)); // Set preview URL
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("owner", formData.owner);
//     data.append("contact", formData.contact);
//     data.append("location", formData.location);
//     if (formData.photo) {
//       data.append("image", formData.photo); // Ensure 'image' matches backend parameter name
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/Shops/add",
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       setAddedShop(response.data);
//       alert("Shop created successfully!");
//       navigate("/"); // Redirect after success
//     } catch (error) {
//       console.error("Error creating shop:", error);
//       alert("Failed to create the shop. Please try again.");
//     }
//   };

//   return (
//     <div className="create-shop-container">
//       <h2>Create Shop</h2>
//       <form className="create-shop-form" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Shop Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="owner"
//           placeholder="Owner Name"
//           value={formData.owner}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="contact"
//           placeholder="Contact"
//           value={formData.contact}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="location"
//           placeholder="Location"
//           value={formData.location}
//           onChange={handleChange}
//           required
//         />
//         <input type="file" accept="image/*" onChange={handlePhotoChange} />
//         {preview && (
//           <img src={preview} alt="Preview" className="photo-preview" />
//         )}
//         <Link to={`/ShopProfile/${addedShop.id}`}>
//           <button type="submit" className="btn-create">
//             Create Shop
//           </button>
//         </Link>
//       </form>
//     </div>
//   );
// };

// export default CreateShop;

//----------------------------










// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./CreateShop.css";

// const CreateShop = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     owner: "",
//     contact: "",
//     location: "",
//     photo: null,
//   });
//   const [preview, setPreview] = useState(null); // For image preview

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, photo: file });
//       setPreview(URL.createObjectURL(file)); // Set preview URL
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("owner", formData.owner);
//     data.append("contact", formData.contact);
//     data.append("location", formData.location);
//     if (formData.photo) {
//       data.append("image", formData.photo); // Ensure 'image' matches backend parameter name
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/Shops/add",
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       alert("Shop created successfully!");
//       // Navigate to ShopProfile page with the new shop's ID
//       navigate(`/shopProfile/${response.data.id}`);
//     } catch (error) {
//       console.error("Error creating shop:", error);
//       alert("Failed to create the shop. Please try again.");
//     }
//   };

//   return (
//     <div className="create-shop-container">
//       <h2>Create Shop</h2>
//       <form className="create-shop-form" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Shop Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="owner"
//           placeholder="Owner Name"
//           value={formData.owner}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="contact"
//           placeholder="Contact"
//           value={formData.contact}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="location"
//           placeholder="Location"
//           value={formData.location}
//           onChange={handleChange}
//           required
//         />
//         <input type="file" accept="image/*" onChange={handlePhotoChange} />
//         {preview && (
//           <img src={preview} alt="Preview" className="photo-preview" />
//         )}
//         <button type="submit" className="btn-create">
//           Create Shop
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateShop;









import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateShop.css";

const CreateShop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    contact: "",
    location: "",
   
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
      contact: formData.contact,
      location: formData.location,
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
