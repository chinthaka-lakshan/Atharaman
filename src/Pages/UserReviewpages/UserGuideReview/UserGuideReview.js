// import React, { useState, useEffect } from "react";
// import "./UserGuideReview.css";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";

// const UserGuideReview = () => {
//   const [reviews, setReviews] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const reviewsPerPage = 3;
//   const navigate = useNavigate();
//   const location = useLocation();

//   const queryParams = new URLSearchParams(location.search);
//   const guideId = queryParams.get("guideId");
//   const userId = queryParams.get("userId");

//   useEffect(() => {
//     if (guideId && userId) {
//       loadReviews(guideId, userId);
//     }
//   }, [guideId, userId]);

//   // Load reviews from the backend
//   const loadReviews = async (guideId, userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/getGuideReviewsByGuideIdAndUserId/`,
//         {
//           params: {
//             guideId: guideId,
//             userId: userId,
//           },
//         }
//       );
//       setReviews(response.data);
//     } catch (error) {
//       console.error("Error loading reviews:", error);
//     }
//   };

//   const totalPages = Math.ceil(reviews.length / reviewsPerPage);
//   const startIndex = (currentPage - 1) * reviewsPerPage;
//   const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Navigate to ReviewForm with data for updating
//   const handleUpdate = (review) => {
//     navigate("/addReview", { state: { review, isUpdate: true } });
//   };

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this review?"
//     );
//     if (confirmed) {
//       try {
//         await axios.delete(`http://localhost:8080/review/${id}`);
//         setReviews(reviews.filter((review) => review.id !== id));
//       } catch (error) {
//         console.error("Error deleting review:", error);
//       }
//     }
//   };

//   return (
//     <div className="all-review-page">
//       <div className="all-review-container">
//         <h1>My Reviews</h1>
//         {reviews.length === 0 ? (
//           <p>No reviews found for this guide and user.</p>
//         ) : (
//           <>
//             <div className="reviews-list">
//               {currentReviews.map((review) => (
//                 <div className="review-card" key={review.id}>
//                   <h3>{review.name}</h3>
//                   <div className="rating">
//                     {Array.from({ length: review.rating }, (_, i) => (
//                       <span key={i} className="star">
//                         ★
//                       </span>
//                     ))}
//                   </div>
//                   <p>{review.comment}</p>
//                   <div className="review-actions">
//                     <button
//                       className="update-btn"
//                       onClick={() => handleUpdate(review)}
//                     >
//                       Update
//                     </button>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDelete(review.id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="pagination">
//               <button
//                 className="pagination-btn"
//                 onClick={handlePrevPage}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//               <span className="page-info">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 className="pagination-btn"
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserGuideReview;




import React, { useState, useEffect } from "react";
import "./UserGuideReview.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const UserGuideReview = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
  const { id: guideId } = useParams(); // Assuming 'id' is the placeId from the route
  
  // Load reviews on component mount
  useEffect(() => {
    if (user && user.id) {
      loadReview(user.id, guideId);
    }
  }, [user?.id, guideId]);
  
  // Function to load reviews from the API
  async function loadReview(userId, guideId) {
    console.log("Fetching reviews with userId:", userId, "and guideId:", guideId);
    try {
      const response = await axios.get(
        `http://localhost:8080/guidereview/getGuideReviewsByGuideIdAndUserId/?userId=${userId}&guideId=${guideId}`
      );
      console.log("API Response:", response.data);
      if (response.data) {
        setReviews(response.data); // Update state with retrieved reviews
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }

  // Pagination variables
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to ReviewForm with data for updating
  const handleUpdate = (review) => {
    if (review.userId === user.id) {
      navigate(`/guideReviewForm/${guideId}`, { state: { review, isUpdate: true } });
    } else {
      alert("You are not allowed to update this review.");
    }
  };

  // Delete review handler with confirmation pop-up
  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm("Do you want to delete this review?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/guidereview/${reviewId}`);
        setReviews(reviews.filter((review) => review.id !== reviewId)); // Update state to remove the deleted review
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <div className="all-review-page">
      <div className="all-review-container">
        <h1>My Reviews</h1>
        <div className="reviews-list">
          {currentReviews.map((review) => (
            <div className="review-card" key={review.id}>
              <h3>{review.name}</h3>
              <div className="rating">
                {Array.from({ length: review.rating }, (_, i) => (
                  <span key={i} className="star">
                    ★
                  </span>
                ))}
              </div>
              <p>{review.comment}</p>
              <div className="review-actions">
                <button
                  className="update-btn"
                  onClick={() => handleUpdate(review)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(review.id)} // Pass review id to handleDelete
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideReview;
