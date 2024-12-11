import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./GuideView.css";
import Navbar from "../../Components/Navbar/Navbar";
import Narangala from "../../Assets/Narangala_1.jpg";
import SachinthaJayaweera from '../../Assets/SachinthaJayaweera_1.jpg'
import Lamborghini from '../../Assets/Lamborghini_1.jpg'
import { Link } from 'react-router-dom';
import axios from "axios";

const GuideView = () => {
  const { id } = useParams();
  const [guideName, setGuideName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const guideLocations = ["Central", "Western", "Uva", "North", "Southern", "Eastern"];
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [extraImagePreviews, setExtraImagePreviews] = useState([null, null, null, null]);

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
        const response = await axios.get(`http://localhost:8080/guides/${id}`);
        const data = response.data;
        setGuideName(data.guideName);
        setDescription(data.description);
        setPhoneNo(data.phoneNo);
        setEmail(data.email);
        setNic(data.nic);
        setMainImagePreview(SachinthaJayaweera);
        setExtraImagePreviews([SachinthaJayaweera, SachinthaJayaweera, SachinthaJayaweera, SachinthaJayaweera]);
      } catch (error) {
        console.error("Error fetching guide details:", error.message);
        alert("Failed to fetch guide details.");
      }
    }

    async function fetchReviews() {
      try {
        const response = await axios.get('http://localhost:8080/placereview');
        setReviews(response.data);
      } catch (error) {
        console.error('Error loading reviews:', error);
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
      <Navbar/>
      <div className="guideView">
        <div className="guidePlatter container">
          <div className="guidePlatter-text">
            <h1>{guideName}</h1>
            <p>{description}</p>
          </div>
          <div className="photo-grid">
            <div className="main-image">
              {mainImagePreview && <img src={mainImagePreview} alt="Main" onClick={() => openImage(mainImagePreview) }/>}
            </div>
            <div className="side-images">
              {extraImagePreviews.map((img, index) =>
                img ? <img key={index} src={img} alt={`Extra ${index + 1}`} onClick={() => openImage(img) }/> : null
              )}
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
                      <img src={location.image || Narangala} alt={location.name} className="tile-img" />
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
                      <h3>Sachintha</h3>
                      <div className="star-rating">{renderStars(review.rating)}</div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No Reviews Found</p>
              )}
            </div>
            <Link to="/guideReviewPage">
              <button className="view-more-button">Add Guide Review</button>
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