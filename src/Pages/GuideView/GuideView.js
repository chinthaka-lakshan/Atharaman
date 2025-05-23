import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./GuideView.css";
import { Link } from 'react-router-dom';
import axios from "axios";
import Elderly from '../../Assets/elderly-person-icon-19.jpg';

const GuideView = () => {
  const { id } = useParams();
  const [name, setGuideName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const [modalImage, setModalImage] = useState(null);
  const [currentLocations, setLocations] = useState([])

  const [reviews, setReviews] = useState([]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="star filled">★</span>); // filled star
      } else {
        stars.push(<span key={i} className="star">☆</span>); // empty star
      }
    }
    return stars;
  };

  useEffect(() => {
    async function fetchGuide() {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/id/${id}`);
        const data = response.data;
        setGuideName(data.name);
        setDescription(data.description);
        setPhoneNo(data.phoneNo);
        setEmail(data.email);
        setNic(data.nic);
        setMainImagePreview(data.mainImagePreview);
      } catch (error) {
        console.error("Error fetching guide details:", error.message);
        alert("Failed to fetch guide details.");
      }
    }

    

    async function fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/id/${id}`);
        let reviewsData = response.data.guideReviewList;
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error loading reviews:", error.message);
        alert("Failed to load reviews.");
      }
    }

    fetchGuide();
    fetchReviews();
  }, [id]);

  const openImage = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div>
      <div className="guideView">
        <div className="guidePlatter container">
          <div className="guidePlatter-text">
            <h1>{name}</h1>
            <p>{description}</p>
          </div>
          <div className="photo-grid">
            <div className="main-image">
              <img src={Elderly} alt="Main"/>
            </div>
          </div>
        </div>
        <div className="main-container">
          <div className="description-container">
            <p>{description}</p>
          </div>
          <div className="details-container">
            <p><strong>Phone No :</strong> {phoneNo}</p>
            <p><strong>E-Mail :</strong> {email}</p>
            <p><strong>NIC :</strong> {nic}</p>
          </div>
          <div className="locations-container">
            <h2>Expert Locations</h2>
            <div className="locations-list">
              {currentLocations.length > 0 ? (
                currentLocations.slice(0, 4).map((location, index) => (
                  <Link key={index} to={`/locationView/${location.id}`}>
                    <div className="locationTile">
                      <img src={location.image} alt={location.name} className="tile-img" />
                        <div className="tile-content">
                          <h3>{location.location}</h3>
                          <p>{location.shortDescription}</p>
                          <div className="star-rating">
                            {renderStars(location.rating || 3)}
                          </div>
                        </div>
                    </div>
                  </Link>
                ))
              ) : (
              <p>No Locations Found</p>
              )}
            </div>
            <button className="view-more-button">View More Locations</button>
          </div>
         <div className="reviews-container">
                    <h2>Guide Reviews</h2>
                    <div className="reviews-list">
                      {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <div key={index} className="reviewTile">
                            <div className="review-header">
                              <h3>{review.userName || "Anonymous"}</h3>
                              <div className="star-rating">{renderStars(review.rating)}</div>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p>No Reviews Found</p>
                      )}
                    </div>
                    <Link to={`/guideReviewForm/${id}`}>
                      <button className="view-more-button">Add Guide Review</button>
                    </Link>
                    <Link to={`/userGuideReview/${id}`}>
                      <button className="view-more-button">My Guide Reviews</button>
                    </Link>
                  </div>
          {modalImage && (
            <div className="modal">
              <div className="modal-content">
                <button className="close-button" onClick={closeModal}>
                  &times;
                </button>
                <img src={modalImage} alt="Enlarged view" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideView;