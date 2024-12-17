// import React, { useState, useEffect } from 'react';
// import './AllReview.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AllReview = () => {
//   const [reviews, setReviews] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const reviewsPerPage = 3;
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadReview();
//   }, []);

//   // Load reviews from the backend
//   async function loadReview() {
//     try {
//       const response = await axios.get('http://localhost:8080/review');
//       setReviews(response.data);
//     } catch (error) {
//       console.error('Error loading reviews:', error);
//     }
//   }

  
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
//     navigate('/addReview', { state: { review, isUpdate: true } });
//   };

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm('Are you sure you want to delete this review?');
//     if (confirmed) {
//       try {
//         await axios.delete(`http://localhost:8080/review/${id}`);
//         setReviews(reviews.filter((review) => review.id !== id));
//       } catch (error) {
//         console.error('Error deleting review:', error);
//       }
//     }
//   };

//   return (
//     <div className="all-review-page">
//       <div className="all-review-container">
//         <h1>All Reviews</h1>
//         <div className="reviews-list">
//           {currentReviews.map((review) => (
//             <div className="review-card" key={review.id}>
//               <h3>{review.name}</h3>
//               <div className="rating">
//                 {Array.from({ length: review.rating }, (_, i) => (
//                   <span key={i} className="star">★</span>
//                 ))}
//               </div>
//               <p>{review.comment}</p>
//               <div className="review-actions">
//                 <button
//                   className="update-btn"
//                   onClick={() => handleUpdate(review)}
//                 >
//                   Update
//                 </button>
//                 <button
//                   className="delete-btn"
//                   onClick={() => handleDelete(review.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="pagination">
//           <button
//             className="pagination-btn"
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <span className="page-info">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="pagination-btn"
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllReview;





import React, { useState, useEffect } from 'react';
import './AllReview.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllReview = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(''); // Store the current logged-in user
  const reviewsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    loadReview();
    loadCurrentUser(); // Load logged-in user's data
  }, []);

  // Load reviews from the backend
  async function loadReview() {
    try {
      const response = await axios.get('http://localhost:8080/review');
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  // Load current user's data (from localStorage or API)
  function loadCurrentUser() {
    const user = localStorage.getItem('username'); // Example: username saved during login
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser('Guest');
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  // Handle page navigation
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
    navigate('/addReview', { state: { review, isUpdate: true, username: currentUser } });
  };

  // Handle delete review
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this review?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/review/${id}`);
        setReviews(reviews.filter((review) => review.id !== id));
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  return (
    <div className="all-review-page">
      <div className="all-review-container">
        <h1>All Reviews</h1>
        <h3>Welcome, {currentUser}!</h3> {/* Display the current user */}
        <div className="reviews-list">
          {currentReviews.map((review) => (
            <div className="review-card" key={review.id}>
              <h3>{review.username || 'Unknown User'}</h3>
              <div className="rating">
                {Array.from({ length: review.rating }, (_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <p>{review.comment}</p>
              <div className="review-actions">
                <button
                  className="update-btn"
                  onClick={() => handleUpdate(review)} // Pass review for update
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
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

export default AllReview;
