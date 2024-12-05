import React, { useEffect, useState } from 'react';
import './AddReview.css'



function AddReview() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };
  const handlePhotoChange = (e) => {
    setPhotos([...e.target.files]); 
  };
  const removePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };


  const handleSubmit = () => {
    console.log({ rating, reviewText,photos});
  };

  

  

  const reviewData = {
    rating,
    reviewText,
  };
  console.log('Review submitted:', reviewData);

  return (
    <div className="review-container">

      <div className="addreview1 container">
        <div className="review1-content">
          <div className="left-section1">
            <div className="user-info1">
              <img src="https://via.placeholder.com/100" alt="User" className="user-image" />
              <h3>User Name</h3>
            </div>
            <div className="review-section1">
              <h2>Tell Us Your Review</h2>
            </div>
            <div>
            <div className='name'>
                <h3> Guide or Place Name </h3>
            </div>
            <img
                src="Assets\AddReview.jpg"
                className="review-image1"
            />
            </div>
          </div>

          <div className="right-section1">
            <div className="rating-section1">
              <h3>How would you rate your experience?</h3>
              <div className="stars1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <span
                    key={value}
                    className={value <= rating ? 'star filled' : 'star1'}
                    onClick={() => handleRatingClick(value)} 
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="review-text1">
              <div className="abc1">
                <h3>Write your review</h3>
              </div>
              <textarea
                value={reviewText}
                onChange={handleReviewChange}
                placeholder="Write your review"
              />
            </div>
            <div className="photo-upload">
              <h3>
                Add Some Photos <span>(optional)</span>
              </h3>
              <input type="file" multiple onChange={handlePhotoChange} />
              <div className="photo-box">
                {photos.length > 5
                  ? photos.map((photo, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(photo)}
                        alt="Uploaded Preview"
                        className="uploaded-photo"
                      />
                    ))
                  : 'Click to add photos or drag and drop'}
              </div>
              
            </div>
            <button className="submit-btn1" onClick={handleSubmit}>
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddReview;
