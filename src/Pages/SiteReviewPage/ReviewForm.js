import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a rating.');
    } else if (!comment.trim()) {
      setError('Please add a comment.');
    } else {
      setError('');
      setShowPopup(true);

      // Display popup, then clear fields after it disappears
      setTimeout(() => {
        setShowPopup(false);
        setRating(0);
        setComment('');
      }, 2000); // Popup displayed for 2 seconds
    }
  };

  return (
    <div className="review-form">
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
  );
};

export default ReviewForm;
