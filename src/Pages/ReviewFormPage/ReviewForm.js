import React, { useState } from 'react';
import './ReviewForm.css';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (rating === 0) {
      setError('Please provide a rating.');
      return;
    }

    if (!comment.trim()) {
      setError('Please add a comment.');
      return;
    }

    setError('');
    const data = {
      username: "Login User", // Replace with the actual username if available
      rating,
      comment,
    };

    try {
      // Send the review data to the backend
      await axios.post(`http://localhost:8080/review`, data);
      setShowPopup(true);

      // Reset form fields after successful submission
      setTimeout(() => {
        setShowPopup(false);
        setRating(0);
        setComment('');
        
        // Navigate to the AllReview page after 2 seconds
        navigate('/AllReview'); // Change this path based on your actual route
      }, 2000); // Popup disappears after 2 seconds
    } catch (err) {
      console.error(err.response?.data || "Error submitting review");
      setError('Failed to submit the review. Please try again.');
    }
  };

  return (
    <div className="Fullpage">
      <div className="review-form">
        <Navbar />
        <h2>Site Review</h2>
        <form onSubmit={handleSubmit}>
          <label>Username: </label>
          <input type="text" placeholder="Username" disabled value="Login User" />

          <div className="rating">
            <label>Rating:</label>
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

          <label>Comments:</label>
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

export default ReviewForm;

