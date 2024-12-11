import React, { useState, useEffect } from "react";
import "./GuideView.css";
import Navbar from "../../Components/Navbar/Navbar";
import SachinthaJayaweera from '../../Assets/SachinthaJayaweera_1.jpg'
import Narangala from "../../Assets/Narangala_1.jpg";
import { Link } from 'react-router-dom';
import axios from "axios";

const GuideView = () => {
  const [modalImage, setModalImage] = useState(null);
  const [currentGuides, setGuides] = useState([]);
  /*const [reviews, setReviews] = useState([]);*/
  const [reviews] = useState([ // Dummy reviews
    {
      reviewerName: "John Doe",
      rating: 5,
      comment: "An amazing place with breathtaking views! Highly recommended for adventure seekers.",
    },
    {
      reviewerName: "Jane Smith",
      rating: 4,
      comment: "The climb was challenging but worth it. A great experience overall!",
    },
    {
      reviewerName: "Sam Wilson",
      rating: 3,
      comment: "Good place to visit, but make sure to check the weather before going.",
    },
    {
      reviewerName: "Emily Davis",
      rating: 5,
      comment: "Absolutely stunning! The golden grass and scenery are unforgettable.",
    },
  ]);

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
    const fetchGuides = async () => {
      try {
        const response = await axios.get("http://localhost:8080/guides");
        setGuides(response.data);
      } catch (error) {
        console.error("Error Fetching Guides:", error);
      }
    };

    /*const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:8080/reviews?guideId=1");
        setReviews(response.data);
      } catch (error) {
        console.error("Error Fetching Reviews:", error);
      }
    };*/

    fetchGuides();
    /*fetchReviews();*/
  }, []);

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
            <h1>Sachintha Jayaweera</h1>
            <p>Sachintha is a great guide for you to lead the way. He is a travelling enthusiast and has shown way for a lot of foreign travellers safely.</p>
          </div>
          <div className="photo-grid">
            <img
              src={Narangala}
              alt="Main view"
              className="main-image"
              onClick={() => openImage(Narangala)}
            />
            <div className="side-images">
              {[Narangala, Narangala, Narangala, Narangala].map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  onClick={() => openImage(image)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="main-container">
          <div className="description-container">
            <p>Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m (1527 m). There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight. As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills. Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m. There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight. As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills. Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m. There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight. As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills.</p>
          </div>
          <div className="side-info">
            <div className="map-view">
              <h2>Location Map</h2>
              <iframe
                title="Narangala Map"
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${latitude},${longitude}`}
                width="100%"
                height="300"
                style={{ border: "0" }}
                allowFullScreen
              ></iframe>
            </div>
            <div className="weather-view">
              <h2>Current Weather</h2>
              {weather && weather.main && weather.weather ? (
                <div>
                  <p>
                    <strong>Temperature:</strong> {weather.main.temp}°C
                  </p>
                  <p>
                    <strong>Condition:</strong> {weather.weather[0].description}
                  </p>
                  <p>
                    <strong>Humidity:</strong> {weather.main.humidity}%
                  </p>
                  <p>
                    <strong>Wind Speed:</strong> {weather.wind.speed} m/s
                  </p>
                </div>
              ) : (
              <p>Loading weather information...</p>
              )}
            </div>
          </div>
          <div className="guides-container">
            <h2>Top Guides Nearby</h2>
            <div className="guides-list">
              {currentLocations.length > 0 ? (
                currentLocations.slice(0, 4).map((location, index) => (
                  <Link key={index} to={`/locationView/${location.id}`}>
                    <div className="guideTile">
                      <img src={location.image || SachinthaJayaweera} alt={location.name} className="tile-img" />
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
              <p>No Guides Found</p>
              )}
            </div>
            <button className="view-more-button">View More Guides</button>
          </div>
          <div className="shops-container">
            <h2>Top Shops Nearby</h2>
            <div className="shops-list">
              {currentLocations.length > 0 ? (
                currentLocations.slice(0, 4).map((location, index) => (
                  <Link key={index} to={`/locationView/${location.id}`}>
                    <div className="shopTile">
                      <img src={location.image || Lamborghini} alt={location.name} className="tile-img" />
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
              <p>No Shops Found</p>
              )}
            </div>
            <button className="view-more-button">View More Shops</button>
          </div>
          <div className="reviews-container">
            <h2>Location Reviews</h2>
            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="reviewTile">
                    <div className="review-header">
                      <h3>{review.reviewerName}</h3>
                      <div className="star-rating">{renderStars(review.rating)}</div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No Reviews Found</p>
              )}
            </div>
            <Link to="/locationReviewPage">
              <button className="view-more-button">Add Location Review</button>
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

export default LocationView;