import React from 'react'
import './SiteReviewPage.css';
import Navbar from '../../Components/Navbar/Navbar';
import {Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";





function SiteReviewPage  ()  {
  const navigate = useNavigate();


  const handleSeeAllReviews = () => {
    navigate("/AllReview"); // Navigate to the AllReview page
  };

  const handleAddReview = () => {
    navigate("/ReviewForm"); // Navigate to the AllReview page
  };


 
  
  
  return (
    <div>
      <Navbar />
      <div className='review container'>
        <div className='review-text'>
          <h1>What Is Your Review ? </h1>
          <p>Welcome To Review Page! You Can See All The Review In Here</p>
          <button className='btn' onClick={handleAddReview}>Add Review</button>
          <button className='btn3' onClick={handleSeeAllReviews}>See All Review</button>
        </div>
        <div />
      </div>
    </div>
  );
}
export default SiteReviewPage;