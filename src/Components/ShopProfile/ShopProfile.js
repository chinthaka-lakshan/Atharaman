// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "./ShopProfile.css";

// const ShopProfile = () => {
//   const navigate = useNavigate();
//   //
//   const [shop, setShop] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedShop, setEditedShop] = useState({
//     name: "",
//     owner: "",
//     contact: "",
//     location: "",
//     photo: null,
//   });
//   const { id } = useParams();

//   // Fetch shop details from the backend
//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         const response = await axios.get(
//           http://localhost:8080/Shops/find-by-id/${id}
//         );
//         console.log(id);

//         setShop(response.data);
//         setEditedShop(response.data); // Initialize editedShop
//       } catch (error) {
//         console.error("Error fetching shop details:", error);
//       }
//     };
//     fetchShop();
//   }, [id]);

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditedShop({ ...editedShop, [name]: value });
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setEditedShop({ ...editedShop, photo: URL.createObjectURL(file) });
//     }
//   };

//   const saveEdit = async () => {
//     try {
//       await axios.put("http://localhost:8080/Shops/update", editedShop);
//       setShop(editedShop);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error saving shop details:", error);
//     }
//   };

//   const deleteShop = async () => {
//     if (window.confirm("Are you sure you want to delete this shop?")) {
//       try {
//         await axios.delete(http://localhost:8080/Shops/${shop.id});
//         alert("Shop deleted!");
//         navigate("/"); // Redirect to home or another page
//       } catch (error) {
//         console.error("Error deleting shop:", error);
//       }
//     }
//   };

//   if (!shop) return <div>Loading...</div>;

//   return (
//     <div className="shop-profile-container">
//       {isEditing ? (
//         <div>
//           <h2>Edit Shop Profile</h2>
//           <input
//             name="name"
//             placeholder="Shop Name"
//             value={editedShop.name}
//             onChange={handleEditChange}
//           />
//           <input
//             name="owner"
//             placeholder="Owner Name"
//             value={editedShop.owner}
//             onChange={handleEditChange}
//           />
//           <input
//             name="contact"
//             placeholder="Contact"
//             value={editedShop.contact}
//             onChange={handleEditChange}
//           />
//           <input
//             name="location"
//             placeholder="Location"
//             value={editedShop.location}
//             onChange={handleEditChange}
//           />
//           <input type="file" accept="image/*" onChange={handlePhotoChange} />
//           {editedShop.photo && (
//             <img
//               src={editedShop.photo}
//               alt="Shop Preview"
//               className="shop-photo-preview"
//             />
//           )}
//           <button onClick={saveEdit} className="btn-save">
//             Save
//           </button>
//           <button onClick={() => setIsEditing(false)} className="btn-cancel">
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <div>
//           <h1>{shop.name}</h1>
//           <img
//             src={shop.photo || "https://via.placeholder.com/150"}
//             alt="Shop"
//             className="shop-photo"
//           />
//           <p>
//             <strong>Id:</strong> {shop.id}
//           </p>
//           <p>
//             <strong>Owner:</strong> {shop.owner}
//           </p>
//           <p>
//             <strong>Contact:</strong> {shop.contact}
//           </p>
//           <p>
//             <strong>Location:</strong> {shop.location}
//           </p>
//           <Link to={/add-item/${shop.id}}>
//             <button className="btn-add-item">Add Item</button>
//           </Link>

//           <button onClick={() => setIsEditing(true)} className="btn-edit">
//             Edit Profile
//           </button>
//           <button onClick={deleteShop} className="btn-delete">
//             Delete Shop
//           </button>
//         </div>
//       )}
//     </div>

//   );
// };

// export default ShopProfile;

//-----------------------
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "./ShopProfile.css";

// const ShopProfile = () => {
//   const navigate = useNavigate();
//   const [shop, setShop] = useState(null);
//   const [items, setItems] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedShop, setEditedShop] = useState({
//     name: "",
//     owner: "",
//     contact: "",
//     location: "",
//     image: null,
//   });
//   const { id } = useParams();
//   // Fetch shop details
//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/Shops/find-by-id/${id}`
//         ); // Adjust ID dynamically
//         setShop(response.data);
//         console.log(response.data);

//         setItems(response.data.itemList);
//         console.log(response.data.itemList);

//         setEditedShop(response.data);
//       } catch (error) {
//         console.error("Error fetching shop details:", error);
//       }
//     };

//     // const fetchItems = async () => {
//     //   try {
//     //     const response = await axios.get("http://localhost:8080/item/get-all");
//     //     setItems(response.data);
//     //   } catch (error) {
//     //     console.error("Error fetching items:", error);
//     //   }
//     // };

//     fetchShop();
//     //fetchItems();
//   }, [id]);

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditedShop({ ...editedShop, [name]: value });
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setEditedShop({ ...editedShop, photo: URL.createObjectURL(file) });
//     }
//   };

//   const saveEdit = async () => {
//     try {
//       // Create FormData to send individual fields and the image file
//       const formData = new FormData();

//       // Append individual shop fields as string parameters
//       formData.append("id", editedShop.id);
//       formData.append("name", editedShop.name);
//       formData.append("owner", editedShop.owner);
//       formData.append("contact", editedShop.contact);
//       formData.append("location", editedShop.location);
      
//       // Append the image file if available
//       if (editedShop.photo) {
//         const file = (e) => e.target.files[0]; // Ensure photo is File-like
//         if (file) {
//           formData.append("image", file);
//         }
//       }

//       // Send the FormData to the backend
//       const response = await axios.put(
//         "http://localhost:8080/Shops/update",
//         formData
//       );

//       // Handle response
//       if (response.status === 200) {
//         setShop(editedShop); // Update the shop details
//         setIsEditing(false); // Exit the editing mode
//         alert("Shop updated successfully!");
//       } else {
//         alert("Failed to update shop.");
//       }
//     } catch (error) {
//       console.error("Error saving shop details:", error);
//       alert("There was an error while saving the shop details.");
//     }
//   };

//   const deleteShop = async () => {
//     if (window.confirm("Are you sure you want to delete this shop?")) {
//       try {
//         await axios.delete(`http://localhost:8080/Shops/${shop.id}`);
//         alert("Shop deleted!");
//         navigate("/");
//       } catch (error) {
//         console.error("Error deleting shop:", error);
//       }
//     }
//   };

//   const handleDeleteItem = async (id) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       try {
//         await axios.delete(`http://localhost:8080/item/${id}`);
//         setItems(items.filter((item) => item.id !== id));
//       } catch (error) {
//         console.error("Error deleting item:", error);
//       }
//     }
//   };

//   const handleEditItem = (id) => {
//     navigate(`/editItemForm/${id}`);
//   };

//   if (!shop) return <div>Loading...</div>;

//   return (
//     <div className="shop-profile-container">
//       {isEditing ? (
//         <div>
//           <h2>Edit Shop Profile</h2>
//           <input
//             name="name"
//             placeholder="Shop Name"
//             value={editedShop.name}
//             onChange={handleEditChange}
//           />
//           <input
//             name="owner"
//             placeholder="Owner Name"
//             value={editedShop.owner}
//             onChange={handleEditChange}
//           />
//           <input
//             name="contact"
//             placeholder="Contact"
//             value={editedShop.contact}
//             onChange={handleEditChange}
//           />
//           <input
//             name="location"
//             placeholder="Location"
//             value={editedShop.location}
//             onChange={handleEditChange}
//           />
//           <input type="file" accept="image/*" onChange={handlePhotoChange} />
//           {editedShop.photo && (
//             <img
//               src={editedShop.photo}
//               alt="Shop Preview"
//               className="shop-photo-preview"
//             />
//           )}
//           <button onClick={saveEdit} className="btn-save">
//             Save
//           </button>
//           <button onClick={() => setIsEditing(false)} className="btn-cancel">
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <div>
//           <h1>{shop.name}</h1>
//           <img
//             src={shop.photo || "https://via.placeholder.com/150"}
//             alt="Shop"
//             className="shop-photo"
//           />
//           <p>
//             <strong>Owner:</strong> {shop.owner}
//           </p>
//           <p>
//             <strong>Contact:</strong> {shop.contact}
//           </p>
//           <p>
//             <strong>Location:</strong> {shop.location}
//           </p>
//           <Link to={`/itemForm/${shop.id}`}>
//             <button className="btn-add-item">Add Item</button>
//           </Link>
//           <button onClick={() => setIsEditing(true)} className="btn-edit">
//             Edit Profile
//           </button>
//           <button onClick={deleteShop} className="btn-delete">
//             Delete Shop
//           </button>
//         </div>
//       )}

//       <h2>Items</h2>
//       {items.length === 0 ? (
//         <p>No items available.</p>
//       ) : (
//         <div className="items-container">
//           {items.map((item) => (
//             <div className="item-card" key={item.id}>
//               <img
//                 src={item.image || "https://via.placeholder.com/100"}
//                 alt={item.name}
//                 className="item-image"
//               />
//               <h3>{item.name}</h3>
//               <p>
//                 <strong>Price:</strong> ${item.price}
//               </p>
//               <p>
//                 <strong>Contact:</strong> {item.contact}
//               </p>
//               <p>
//                 <strong>Location:</strong> {item.location}
//               </p>
//               <button
//                 className="btn-edit-item"
//                 onClick={() => handleEditItem(item.id)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="btn-delete-item"
//                 onClick={() => handleDeleteItem(item.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShopProfile;










import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ShopProfile.css";

const ShopProfile = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedShop, setEditedShop] = useState({
    name: "",
    owner: "",
    contact: "",
    location: "",
    image: null,
  });

  // Get the logged-in userId from localStorage
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedUser?.id;
  const token = loggedUser?.token;

  // Fetch shop details by userId
  useEffect(() => {
    const fetchShopByUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/Shops/find-by-user-id/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.length > 0) {
          const shopData = response.data[0]; // Assuming one shop per user
          setShop(shopData);
          setItems(shopData.itemList || []);
          setEditedShop(shopData);
        } else {
          alert("No shop found for the logged-in user.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching shop by userId:", error);
        alert("Failed to load shop profile. Please try again later.");
      }
    };

    if (userId) {
      fetchShopByUserId();
    } else {
      alert("User not logged in. Please log in to view your shop profile.");
      navigate("/login");
    }
  }, [userId, token, navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedShop({ ...editedShop, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedShop({ ...editedShop, photo: URL.createObjectURL(file) });
    }
  };

  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("id", editedShop.id);
      formData.append("name", editedShop.name);
      formData.append("owner", editedShop.owner);
      formData.append("contact", editedShop.contact);
      formData.append("location", editedShop.location);
      if (editedShop.photo) {
        formData.append("image", editedShop.photo);
      }

      const response = await axios.put(
        "http://localhost:8080/Shops/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setShop(editedShop);
        setIsEditing(false);
        alert("Shop updated successfully!");
      } else {
        alert("Failed to update shop.");
      }
    } catch (error) {
      console.error("Error saving shop details:", error);
      alert("There was an error while saving the shop details.");
    }
  };

  const deleteShop = async () => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        await axios.delete(`http://localhost:8080/Shops/${shop.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Shop deleted!");
        navigate("/");
      } catch (error) {
        console.error("Error deleting shop:", error);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:8080/item/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(items.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleEditItem = (id) => {
    navigate(`/editItemForm/${id}`);
  };

  if (!shop) return <div>Loading...</div>;

  return (
    <div className="shopProfile">
      <div className="shop-profile-container">
        {isEditing ? (
          <div>
            <h2>Edit Shop Profile</h2>
            <input
              name="name"
              placeholder="Shop Name"
              value={editedShop.name}
              onChange={handleEditChange}
            />
            <input
              name="owner"
              placeholder="Owner Name"
              value={editedShop.owner}
              onChange={handleEditChange}
            />
            <input
              name="contact"
              placeholder="Contact"
              value={editedShop.contact}
              onChange={handleEditChange}
            />
            <input
              name="location"
              placeholder="Location"
              value={editedShop.location}
              onChange={handleEditChange}
            />
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {editedShop.photo && (
              <img
                src={editedShop.photo}
                alt="Shop Preview"
                className="shop-photo-preview"
              />
            )}
            <button onClick={saveEdit} className="btn-save">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <h1>{shop.name}</h1>
            <img
              src={shop.photo || "https://via.placeholder.com/150"}
              alt="Shop"
              className="shop-photo"
            />
            <p>
              <strong>Owner:</strong> {shop.owner}
            </p>
            <p>
              <strong>Contact:</strong> {shop.contact}
            </p>
            <p>
              <strong>Location:</strong> {shop.location}
            </p>
            <Link to={`/itemForm/${shop.id}`}>
              <button className="btn-add-item">Add Item</button>
            </Link>
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              Edit Profile
            </button>
            <button onClick={deleteShop} className="btn-delete">
              Delete Shop
            </button>
          </div>
        )}

        <h2>Items</h2>
        {items.length === 0 ? (
          <p>No items available.</p>
        ) : (
          <div className="items-container">
            {items.map((item) => (
              <div className="item-card" key={item.id}>
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className="item-image"
                />
                <h3>{item.name}</h3>
                <p>
                  <strong>Price:</strong> ${item.price}
                </p>
                <button
                  className="btn-edit-item"
                  onClick={() => handleEditItem(item.id)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete-item"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProfile;
