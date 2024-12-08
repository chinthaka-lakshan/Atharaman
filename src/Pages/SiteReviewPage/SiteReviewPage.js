import React, { useRef } from 'react'
import './SiteReviewPage.css';
import Navbar from '../../Components/Navbar/Navbar';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";



 


const BASE_API = "http://localhost:9000/api/products";

function SiteReviewPage(){
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const[ isSubmiting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: '',
    review: ''
  });

  

  const scrollHandler = (eleRef) => {
    if (eleRef && eleRef.current) {
      window.scrollTo({ top: eleRef.current.offsetTop, behavior: 'smooth'});
    }
    
  };

  const handleSeeAllReviews = () => {
    navigate("/AllReview"); // Navigate to the AllReview page
  };

 

  const section1 = useRef();
  

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };


  const handleSubmit = () => {

          const reviewData = {
            rating,
            review,
          };
          console.log('Review submitted:', reviewData);
          
          
  };
 

  const handleDelete = () => {
    // Confirmation pop-up
    if (window.confirm("Are you sure you want to delete this form data?")) {
      // Action on delete confirmed
      setFormData({
        rating: '',
        review: ''
      });
      console.log("Form data deleted.");
    } else {
      // Action on cancel
      console.log("Delete action canceled.");
    }
  };


  
  

  

  return (
    <div>
      <Navbar />
      <div className='review container'>
        <div className='review-text'>
          <h1>What Is Your Review ? </h1>
          <p>Welcome To Review Page! You Can See All The Review In Here</p>
          <button className='btn' onClick={() => scrollHandler(section1)}>Add Review</button>
          <button className='btn3'onClick={handleSeeAllReviews} >See All Review</button>
        </div>
        <div />
      </div>

            
      <div className='addreview container' ref={section1}>
        <div className="review-content">
          <div className="left-section">
            <div className="user-info">
              <img src="https://via.placeholder.com/100" alt="User" className="user-image" />
              <h3 >User Name</h3>
            </div>
            <div className="review-section">
              <h2>Tell Us Your Review</h2>
            </div>
          </div>

          <div className="right-section">
            <div className="rating-section">
              <h3>How would you rate your experience?</h3>
              <div className="stars" >
                {[1, 2, 3, 4, 5].map((value) => (
                  <span
                    key={value}
                    className={value <= rating ? "star filled" : "star"}
                    onClick={() => handleRatingClick(value)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="review-text">
              <div className='abc'>
                <h3>Write your review</h3>
              </div>
              <textarea
                value={review}
                onChange={handleReviewChange}
                placeholder="Write your review" />
            </div>
            <button className="submit-btn"  type='submit'  onClick={handleSubmit}>
              {isSubmiting ? "Submiting....": "Submit Review"}
              
            </button>
          
      
          </div>
        </div>
        </div>
        
      </div>

    
    
           
  );
}
export default SiteReviewPage;


