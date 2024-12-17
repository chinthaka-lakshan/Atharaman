import React from 'react'
import './SiteReviewPage.css';
import { useNavigate } from "react-router-dom";

const SiteReviewPage =() => {
  const navigate = useNavigate(); 

  const handleSeeAllReviews = () => {
    navigate("/allReviews"); 
  }

  const handleAddReviews = () => {
    navigate("/addReview"); 
  }
  
  return (
    <div>
      <div className='review container'>
        <div className='review-text'>
          <h1>Share Your Thoughts</h1>
          <p>Welcome To Review Page! You Can See All The Reviews In Here</p>
          <div className='buttons'>
            <button className='btn' onClick={handleAddReviews}>Add Review</button>
            <button className='btn' onClick={handleSeeAllReviews}>See All Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteReviewPage;