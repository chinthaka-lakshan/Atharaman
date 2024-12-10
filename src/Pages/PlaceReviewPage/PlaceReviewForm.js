import React from 'react';
import './PlaceReviewForm.css';
import Navbar from '../../Components/Navbar/Navbar';
import { useState } from 'react';



const PlaceReviewForm = () => {

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    // const [photos, setPhotos] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState("");

    // const handleFileChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     setPhotos(files);
    // };
  
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
          // setPhotos([]);
        }, 2000); // Popup displayed for 2 seconds
      }
    };
  
    return (
          <div className='Fullpage1'>    
            <div className="placereview-form">
              <Navbar/>
              <h2>Place Review</h2>
              <form onSubmit={handleSubmit}>
                <label2>Username: </label2>
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


                {/* <label1>Photos:</label1>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                <div className="photo-preview">
                    {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={URL.createObjectURL(photo)}
                        alt={Preview ${index + 1}}
                        className="photo-thumb"
                    />
                    ))}
                </div>

                {error && <p className="error">{error}</p>} */}
  
                <button type="submit">Submit</button>
              </form>
  
              {showPopup && <div className="popup">Successfully Submitted!</div>}
            </div> 
          </div>  
    );
  };
  
  export default PlaceReviewForm;