import './GuideReviewForm.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams,useLocation } from 'react-router-dom';

const GuideReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id: guideId } = useParams(); // Get guide ID from URL params
  const user = JSON.parse(localStorage.getItem('user')); // Fetch user from local storage

  // Mock review and isUpdate for demonstration (Replace with your state management logic)
  // const isUpdate = false; // Replace with actual update flag
  // const review = null; // Replace with actual review data if updating

  const { review, isUpdate } = location.state || {}; 

  // Pre-fill fields for update
  useEffect(() => {
    if (isUpdate && review) {
      setRating(review.rating || 0);
      setComment(review.comment || '');
    }
  }, [isUpdate, review]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }

    if (!guideId) {
      setError('Invalid guide. Please try again.');
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

    // Prepare payload
    const payload = {
      rating,
      comment,
      guideId:guideId,
      userId: user.id,  // User ID from local storage
    };

    if (isUpdate && review) {
      payload.id = review.id; // Include review ID for updates
    }

    try {
      if (isUpdate) {
        console.log("hi"+payload.comment);
        console.log(review.id);
        // Update existing review
        await axios.put(`http://localhost:8080/guidereview/update/${review.id}`, payload);
        alert('Review updated successfully!');
      } else {
        // Add a new review
        await axios.post('http://localhost:8080/guidereview', payload);
        alert('Review submitted successfully!');
      }

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/guides'); // Navigate back to guides page
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || 'Error submitting review');
      setError('Failed to submit the review. Please try again.');
    }
  };

  return (
    <div className="Fullpage1">
      <div className="locationreview-form">
        <h2>{isUpdate ? 'Update Guide Review' : 'Submit Guide Review'}</h2>
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

export default GuideReviewForm;
