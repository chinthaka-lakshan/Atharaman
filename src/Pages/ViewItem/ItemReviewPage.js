// import React, { useState } from 'react';
// import './ItemReviewPage.css';
// import { DriveFolderUploadOutlined } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

// const ItemReviewForm = () => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [error, setError] = useState('');
//   const [image1, setImage1] = useState(null);
//   const [extraImages, setExtraImages] = useState([null, null, null, null]);
//   const [imagePreview, setImagePreview] = useState({
//     mainImage: null,
//     extraImages: [null, null, null, null],
//   });

//   const navigate = useNavigate();

//   const handleImageChange = (setter, index, e) => {
//     const file = e.target.files[0];
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (file && !allowedTypes.includes(file.type)) {
//       alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
//       return;
//     }

//     if (index === -1) {
//       setter(file ? file : null); // Main image
//       setImagePreview((prev) => ({ ...prev, mainImage: file ? URL.createObjectURL(file) : null }));
//     } else {
//       const updatedImages = [...extraImages];
//       updatedImages[index] = file ? file : null; // Extra images
//       setExtraImages(updatedImages);

//       const updatedPreviews = [...imagePreview.extraImages];
//       updatedPreviews[index] = file ? URL.createObjectURL(file) : null;
//       setImagePreview((prev) => ({ ...prev, extraImages: updatedPreviews }));
//     }
//   };

//   const handlePopupClose = () => {
//     setShowPopup(false);
//     navigate(); // Navigate to the ViewItem page
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (rating === 0) {
//       setError('Please provide a rating.');
//       return;
//     } else if (!comment.trim()) {
//       setError('Please add a comment.');
//       return;
//     } else {
//       setError('');
//       setShowPopup(true);
//     }

//     const formData = new FormData();
//     formData.append('rating', rating);
//     formData.append('comment', comment);

//     if (image1) formData.append('mainImage', image1);
//     extraImages.forEach((img, idx) => {
//       if (img) formData.append(`extraImage${idx + 1}`, img); // Matches backend array handling
//     });

//     try {
//       const response = await fetch('http://localhost:8080/itemReview/save', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         console.log('Item Review added successfully!');
//         alert('Item Review added successfully!');

//         setRating(0);
//         setComment('');
//         setImage1(null);
//         setExtraImages([null, null, null, null]);
//         setImagePreview({ mainImage: null, extraImages: [null, null, null, null] });

//         setTimeout(() => {
//           setShowPopup(false);
//           handlePopupClose();
//         }, 1000); // Popup displayed for 1 second
//       } else {
//         setError('Failed to submit the review.');
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <div className="Fullpage2">
//       <div className="itemreview-form">
        
//         <h2>Item Review</h2>
//         <form onSubmit={handleSubmit}>
//           <label>Username:</label>
//           <input type="text" placeholder="Username" disabled value="Login User" />

//           <div className="rating">
//             <label>Rating:</label>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <span
//                 key={star}
//                 className={`star ${star <= rating ? 'selected' : ''}`}
//                 onClick={() => setRating(star)}
//               >
//                 ★
//               </span>
//             ))}
//           </div>

//           <label>Comments:</label>
//           <textarea
//             placeholder="Write your comments here..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />

//           <label>Photos:</label>
//           <div className="uploadButtons">
//             {['Main Image', 'Image 2', 'Image 3', 'Image 4', 'Image 5'].map((label, index) => (
//               <div key={index} className="formInput">
//                 <label htmlFor={`fileInput${index}`} className="fileUploadLabel">
//                   <DriveFolderUploadOutlined className="uploadIcon" />
//                   <span>{label}</span>
//                 </label>
//                 <input
//                   type="file"
//                   id={`fileInput${index}`}
//                   onChange={(e) =>
//                     handleImageChange(
//                       index === 0 ? setImage1 : null,
//                       index === 0 ? -1 : index - 1,
//                       e
//                     )
//                   }
//                   style={{ display: 'none' }}
//                 />
//                 {index === 0 && imagePreview.mainImage && (
//                   <img src={imagePreview.mainImage} alt="Main preview" className="image-preview" />
//                 )}
//                 {index > 0 && imagePreview.extraImages[index - 1] && (
//                   <img
//                     src={imagePreview.extraImages[index - 1]}
//                     alt={`Extra preview ${index}`}
//                     className="image-preview"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           {error && <p className="error">{error}</p>}

//           <button type="submit">Submit</button>
//         </form>

       
//       </div>
//     </div>
//   );
// };

// export default ItemReviewForm;

// import React, { useState } from "react";
// import "./ItemReviewPage.css";
// import { DriveFolderUploadOutlined } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// const ItemReviewForm = () => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [error, setError] = useState("");
//   const [image1, setImage1] = useState(null);
//   const [extraImages, setExtraImages] = useState([null, null, null, null]);
//   const [imagePreview, setImagePreview] = useState({
//     mainImage: null,
//     extraImages: [null, null, null, null],
//   });

//   const navigate = useNavigate();

//   const handleImageChange = (setter, index, e) => {
//     const file = e.target.files[0];
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//     if (file && !allowedTypes.includes(file.type)) {
//       alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
//       return;
//     }

//     if (index === -1) {
//       setter(file ? file : null); // Main image
//       setImagePreview((prev) => ({ ...prev, mainImage: file ? URL.createObjectURL(file) : null }));
//     } else {
//       const updatedImages = [...extraImages];
//       updatedImages[index] = file ? file : null; // Extra images
//       setExtraImages(updatedImages);

//       const updatedPreviews = [...imagePreview.extraImages];
//       updatedPreviews[index] = file ? URL.createObjectURL(file) : null;
//       setImagePreview((prev) => ({ ...prev, extraImages: updatedPreviews }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (rating === 0) {
//       setError("Please provide a rating.");
//       return;
//     } else if (!comment.trim()) {
//       setError("Please add a comment.");
//       return;
//     } else {
//       setError("");
//       setShowPopup(true);
//     }

//     const formData = new FormData();
//     formData.append("rating", rating);
//     formData.append("comment", comment);
//     formData.append("itemId", 1); // Replace with dynamic itemId if needed
//     formData.append("userId", 1); // Replace with dynamic userId if needed

//     if (image1) formData.append("mainImage", image1);
//     extraImages.forEach((img, idx) => {
//       if (img) formData.append("extraImage", img); // Backend expects an array of images
//     });

//     try {
//       const response = await fetch("http://localhost:8080/itemReview/save", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         console.log("Item Review added successfully!");
//         alert("Item Review added successfully!");

//         setRating(0);
//         setComment("");
//         setImage1(null);
//         setExtraImages([null, null, null, null]);
//         setImagePreview({ mainImage: null, extraImages: [null, null, null, null] });

//         setTimeout(() => {
//           setShowPopup(false);
//           navigate(); // Redirect to another page if needed
//         }, 1000); // Popup displayed for 1 second
//       } else {
//         setError("Failed to submit the review.");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div className="Fullpage2">
//       <div className="itemreview-form">
//         <h2>Item Review</h2>
//         <form onSubmit={handleSubmit}>
//           <label>Username:</label>
//           <input type="text" placeholder="Username" disabled value="Login User" />

//           <div className="rating">
//             <label>Rating:</label>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <span
//                 key={star}
//                 className={`star ${star <= rating ? "selected" : ""}`}
//                 onClick={() => setRating(star)}
//               >
//                 ★
//               </span>
//             ))}
//           </div>

//           <label>Comments:</label>
//           <textarea
//             placeholder="Write your comments here..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />

//           <label>Photos:</label>
//           <div className="uploadButtons">
//             {["Main Image", "Image 2", "Image 3", "Image 4", "Image 5"].map((label, index) => (
//               <div key={index} className="formInput">
//                 <label htmlFor={`fileInput${index}`} className="fileUploadLabel">
//                   <DriveFolderUploadOutlined className="uploadIcon" />
//                   <span>{label}</span>
//                 </label>
//                 <input
//                   type="file"
//                   id={`fileInput${index}`}
//                   onChange={(e) =>
//                     handleImageChange(
//                       index === 0 ? setImage1 : null,
//                       index === 0 ? -1 : index - 1,
//                       e
//                     )
//                   }
//                   style={{ display: "none" }}
//                 />
//                 {index === 0 && imagePreview.mainImage && (
//                   <img src={imagePreview.mainImage} alt="Main preview" className="image-preview" />
//                 )}
//                 {index > 0 && imagePreview.extraImages[index - 1] && (
//                   <img
//                     src={imagePreview.extraImages[index - 1]}
//                     alt={`Extra preview ${index}`}
//                     className="image-preview"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           {error && <p className="error">{error}</p>}

//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ItemReviewForm;
























import React, { useState, useEffect } from "react";
import "./ItemReviewPage.css";
import { DriveFolderUploadOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ItemReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [image1, setImage1] = useState(null);
  const [extraImages, setExtraImages] = useState([null, null, null, null]);
  const [imagePreview, setImagePreview] = useState({
    mainImage: null,
    extraImages: [null, null, null, null],
  });
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
    } else {
      alert("You need to log in first.");
      navigate("/login"); // Redirect to login if user is not logged in
    }
  }, [navigate]);

  const handleImageChange = (setter, index, e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file && !allowedTypes.includes(file.type)) {
      alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
      return;
    }

    if (index === -1) {
      setter(file ? file : null); // Main image
      setImagePreview((prev) => ({ ...prev, mainImage: file ? URL.createObjectURL(file) : null }));
    } else {
      const updatedImages = [...extraImages];
      updatedImages[index] = file ? file : null; // Extra images
      setExtraImages(updatedImages);

      const updatedPreviews = [...imagePreview.extraImages];
      updatedPreviews[index] = file ? URL.createObjectURL(file) : null;
      setImagePreview((prev) => ({ ...prev, extraImages: updatedPreviews }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please provide a rating.");
      return;
    } else if (!comment.trim()) {
      setError("Please add a comment.");
      return;
    } else {
      setError("");
      setShowPopup(true);
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("itemId", 1); // Replace with dynamic itemId if needed
    formData.append("userId", user.id); // Dynamically use the logged-in user's ID

    if (image1) formData.append("mainImage", image1);
    extraImages.forEach((img, idx) => {
      if (img) formData.append("extraImage", img); // Backend expects an array of images
    });

    try {
      const response = await fetch("http://localhost:8080/itemReview/save", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Item Review added successfully!");
        alert("Item Review added successfully!");

        setRating(0);
        setComment("");
        setImage1(null);
        setExtraImages([null, null, null, null]);
        setImagePreview({ mainImage: null, extraImages: [null, null, null, null] });

        setTimeout(() => {
          setShowPopup(false);
          navigate(""); // Redirect to profile or another page
        }, 500); // Popup displayed for 1 second
      } else {
        setError("Failed to submit the review.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="Fullpage2">
      <div className="itemreview-form">
        <h2>Item Review</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            disabled
            value={user?.username || "Loading..."}
          />

          <div className="rating">
            <label>Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? "selected" : ""}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <label>Comments:</label>
          <textarea
            placeholder="Write your comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <label>Photos:</label>
          <div className="uploadButtons">
            {["Main Image", "Image 2", "Image 3", "Image 4", "Image 5"].map((label, index) => (
              <div key={index} className="formInput">
                <label htmlFor={`fileInput${index}`} className="fileUploadLabel">
                  <DriveFolderUploadOutlined className="uploadIcon" />
                  <span>{label}</span>
                </label>
                <input
                  type="file"
                  id={`fileInput${index}`}
                  onChange={(e) =>
                    handleImageChange(
                      index === 0 ? setImage1 : null,
                      index === 0 ? -1 : index - 1,
                      e
                    )
                  }
                  style={{ display: "none" }}
                />
                {index === 0 && imagePreview.mainImage && (
                  <img src={imagePreview.mainImage} alt="Main preview" className="image-preview" />
                )}
                {index > 0 && imagePreview.extraImages[index - 1] && (
                  <img
                    src={imagePreview.extraImages[index - 1]}
                    alt={`Extra preview ${index}`}
                    className="image-preview"
                  />
                )}
              </div>
            ))}
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ItemReviewForm;
