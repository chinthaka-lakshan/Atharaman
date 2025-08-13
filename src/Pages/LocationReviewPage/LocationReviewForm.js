import './LocationReviewForm.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const LocationReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { id: locationId } = useParams(); // Location ID from URL
  const location = useLocation(); // Access location state for update
  const user = JSON.parse(localStorage.getItem('user')); // Fetch user from local storage

  const { review, isUpdate } = location.state || {}; // Review and update flag from navigation

  // Pre-fill fields for update
  useEffect(() => {
    if (isUpdate && review) {
      setRating(review.rating || 0);
      setComment(review.comment || '');
    }
  }, [isUpdate, review]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }

    if (!locationId) {
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

    const payload = {
      
      rating,
      comment,
      placeId:locationId,
      userId: user.id, // User ID from local storage
       // Username from local storage
      // Place ID from URL params
      
      
    };

    if(isUpdate && review){
      payload.id=review.id;
    }
    // const payload_post = {
      
    //   rating,
    //   comment,
    //   placeId:locationId,
    //   userId: user.id,
    //    // User ID from local storage
    //    // Username from local storage
    //   // Place ID from URL params
      
      
    // };

    

    try {
      if (isUpdate) {
        console.log("hi"+payload.comment);
        console.log(review.id);
        
        // Update the existing review
        await axios.put(`http://localhost:8080/placereview/update-by-user-id/${user.id}`, payload);
        alert('Review updated successfully!');
      } else {
        // Add a new review
        
        await axios.post('http://localhost:8080/placereview/add', payload);
        alert('Review submitted successfully!');
      }

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/locations'); // Navigate to locations page
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || 'Error submitting review');
      setError('Failed to submit the review. Please try again.');
    }
  };

  return (
    <div className="Fullpage1">
      <div className="locationreview-form">
        <h2>{isUpdate ? 'Update Location Review' : 'Submit Location Review'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={user?.username || ''}
            readOnly // Makes the input read-only
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
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">{isUpdate ? 'Update' : 'Submit'}</button>
        </form>
        {showPopup && <div className="popup">Successfully Submitted!</div>}
      </div>
    </div>
  );
};

export default LocationReviewForm;
