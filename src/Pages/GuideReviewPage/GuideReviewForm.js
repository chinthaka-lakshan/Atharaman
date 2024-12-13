import React, { useState, useEffect } from 'react';
import './GuideReviewForm.css';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';

const GuideReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');

  const apiBaseUrl = 'http://localhost:8080/guidereview'; // Replace with your backend URL

  // Fetch all reviews on component load
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a rating.');
    } else if (!comment.trim()) {
      setError('Please add a comment.');
    } else {
      setError('');
      try {
        const newReview = { rating, comment };
        await axios.post(apiBaseUrl, newReview);
        setShowPopup(true);

        // Refresh the reviews and clear fields
        setTimeout(() => {
          setShowPopup(false);
          setRating(0);
          setComment('');
          fetchReviews();
        }, 2000);
      } catch (err) {
        console.error('Error submitting review:', err);
      }
    }
  };

  return (
    <div className="Fullpage1">
      <Navbar />
      <div className="placereview-form">
        <h2>Guide Review</h2>
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

        <div className="reviews-list">
          <h3>All Reviews</h3>
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="rating">
                {Array.from({ length: review.rating }, (_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideReviewForm;
