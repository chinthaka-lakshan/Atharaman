import React from 'react'
import './SiteReviewPage.css';
import Navbar from '../../Components/Navbar/Navbar';
import {Link} from 'react-router-dom';




function SiteReviewPage(){
  
  
  return (
    <div>
      <Navbar />
      <div className='review container'>
        <div className='review-text'>
          <h1>What Is Your Review ? </h1>
          <p>Welcome To Review Page! You Can See All The Review In Here</p>
          <button className='btn'> <Link to="/ReviewForm"> Add Review</Link> </button>
        </div>
        <div />
      </div>
    </div>
  );
}
export default SiteReviewPage;


