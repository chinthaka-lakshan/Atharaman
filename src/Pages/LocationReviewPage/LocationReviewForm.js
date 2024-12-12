import React, { useState } from 'react';
import './LocationReviewForm.css';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // For navigation

const LocationReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please provide a rating.');
    } else if (!comment.trim()) {
      setError('Please add a comment.');
    } else {
      setError('');
      try {
        // Send POST request to backend to create a new review
        await axios.post('http://localhost:8080/placereview', {
          username: "Login User", // Replace with actual logged-in username if available
          rating,
          comment,
        });

        // Display success message
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setRating(0);
          setComment('');

          // Navigate to Location View
          navigate('/locationView/:id');
        }, 2000);
      } catch (err) {
        console.error(err.response?.data || "Error submitting review");
        setError('Failed to submit the review. Please try again.');
      }
    }
  };

  return (
    <div className='Fullpage1'>    
      <div className="locationreview-form">
        <h2>Location Review</h2>
        <form onSubmit={handleSubmit}>
          <label>Username :</label>
          <input type="text" placeholder="Username" disabled value="Login User" />
          <div className="rating">
            <label>Rating :</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'selected' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <label>Comments :</label>
          <textarea
            placeholder="Write your comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Submit</button>
        </form>
        {showPopup && <div className="popup">Successfully Submitted!</div>}
      </div> 
    </div>  
  );  
};

export default LocationReviewForm;