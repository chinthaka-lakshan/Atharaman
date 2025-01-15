import './ItemReviewForm.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ItemReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id: itemId } = useParams(); // Get location ID from URL
  const user = JSON.parse(localStorage.getItem('user')); // Fetch user from local storage

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }

    if (!itemId) {
      setError('Invalid location. Please try again.');
      return;
    }

    if (rating === 0) {
      setError('Please provide a rating.');
      return;
    }

    if (!comment.trim()) {
      setError('Please add a comment.');
      return;
    }

    setError('');

    try {
      const response = await axios.post('http://localhost:8080/itemReview/save', {
        userId: user.id, // user id from local storage
        username: user.username, // username from local storage
        itemId: itemId, // placeId from URL params
        rating,
        comment,
      });

      if (response.data) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setRating(0);
          setComment('');
          navigate('/locations'); // Navigate to locations page
        }, 2000);
      } else {
        setError('Failed to submit the review. Please try again.');
      }
    } catch (err) {
      console.error(err.response?.data || 'Error submitting review');
      setError('Failed to submit the review. Please try again.');
    }
  };

  return (
    <div className="Fullpage1">
      <div className="locationreview-form">
        <h2>Item Review</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={user?.username || ''}
            readOnly // Makes the input read-only if editing is not allowed
          />
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

export default ItemReviewForm;