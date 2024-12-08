<<<<<<< Updated upstream
import React from 'react'
import './SiteReviewPage.css';
import Navbar from '../../Components/Navbar/Navbar';
import {Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";





function SiteReviewPage  ()  {
  const navigate = useNavigate();

=======
import React, { useRef, useState } from 'react';
import './SiteReviewPage.css';
import Navbar from '../../Components/Navbar/Navbar';
import { useNavigate } from "react-router-dom";

function SiteReviewPage() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const section1 = useRef();

  const scrollHandler = (eleRef) => {
    if (eleRef && eleRef.current) {
      window.scrollTo({ top: eleRef.current.offsetTop, behavior: 'smooth' });
    }
  };
>>>>>>> Stashed changes

  const handleSeeAllReviews = () => {
    navigate("/AllReview"); // Navigate to the AllReview page
  };

<<<<<<< Updated upstream
  const handleAddReview = () => {
    navigate("/ReviewForm"); // Navigate to the AllReview page
  };


 
  
  
=======
  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Rating is required!");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("Submitted Successfully!");

      // Clear form and reset rating after 3 seconds
      setTimeout(() => {
        setRating(0);
        setReview('');
        setSuccessMessage('');
      }, 3000);
    }, 1000);

    const reviewData = {
      rating,
      review,
    };
    console.log('Review submitted:', reviewData);
  };

>>>>>>> Stashed changes
  return (
    <div>
      <Navbar />
      <div className='review container'>
        <div className='review-text'>
<<<<<<< Updated upstream
          <h1>What Is Your Review ? </h1>
          <p>Welcome To Review Page! You Can See All The Review In Here</p>
          <button className='btn' onClick={handleAddReview}>Add Review</button>
=======
          <h1>What Is Your Review?</h1>
          <p>Welcome To Review Page! You Can See All The Reviews Here</p>
          <button className='btn' onClick={() => scrollHandler(section1)}>Add Review</button>
>>>>>>> Stashed changes
          <button className='btn3' onClick={handleSeeAllReviews}>See All Review</button>
        </div>
      </div>
<<<<<<< Updated upstream
    </div>
  );
}
export default SiteReviewPage;
=======

      <div className='addreview container' ref={section1}>
        <div className="review-content">
          <div className="left-section">
            <div className="user-info">
              <img src="https://via.placeholder.com/100" alt="User" className="user-image" />
              <h3>User Name</h3>
            </div>
            <div className="review-section">
              <h2>Tell Us Your Review</h2>
            </div>
          </div>

          <div className="right-section">
            <div className="rating-section">
              <h3>How would you rate your experience?</h3>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <span
                    key={value}
                    className={`star ${value <= rating ? "filled" : ""}`}
                    onClick={() => handleRatingClick(value)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="review-text">
              <h3>Write your review</h3>
              <textarea
                value={review}
                onChange={handleReviewChange}
                placeholder="Write your review"
              />
            </div>
            <button className="submit-btn" type='submit' onClick={handleSubmit}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteReviewPage;
>>>>>>> Stashed changes
