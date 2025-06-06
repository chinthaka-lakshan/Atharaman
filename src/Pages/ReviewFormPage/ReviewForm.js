import React, { useState, useEffect } from "react";
import "./ReviewForm.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ReviewForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure passed data if available
  const { review, isUpdate } = location.state || {};

  // Retrieve logged-in user details from localStorage
  const user = JSON.parse(localStorage.getItem("user")); // Assuming userId is stored in localStorage

  // Component State
  const [userName, setUserName] = useState(user?.username || ""); // Username field
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (rating === 0) {
      setError("Please provide a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please add a comment.");
      return;
    }
    setError("");

    try {
      // Payload with logged-in user's userId
      const payload = {
        id: review?.id || null, // Include id if required
        userName,
        rating,
        comment,
        userId: user?.id, // Pass logged-in user's id
      };

      if (isUpdate) {
        // Update an existing review using userId in the URL
        await axios.put(`http://localhost:8080/review/${user.id}`, payload);
        alert("Review updated successfully!");
      } else {
        // Create a new review
        await axios.post("http://localhost:8080/review", payload);
        alert("Review submitted successfully!");
      }

      // Navigate back to the All Reviews page
      navigate("/AllReviews");
    } catch (err) {
      console.error(err.response?.data || "Error submitting review");
      setError("Failed to submit the review. Please try again.");
    }
  };

  return (
    <div className="Fullpage23">
      <div className="review-form">
        <h2>{isUpdate ? "Update Review" : "Submit a Review"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            disabled={true} // Prevent changes to username
          />

          {/* Rating Stars */}
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

          {/* Comment Field */}
          <label>Comment:</label>
          <textarea
            placeholder="Write your comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          {/* Error Display */}
          {error && <p className="error">{error}</p>}

          {/* Submit Button */}
          <button type="submit">
            {isUpdate ? "Update Review" : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;


