import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./LocationView.css";
import { Link } from "react-router-dom";
import SachinthaJayaweera from '../../Assets/SachinthaJayaweera_1.jpg'
import Lamborghini from '../../Assets/Lamborghini_1.jpg'
import axios from "axios";

const LocationView = () => {
  const { id } = useParams();
  const [location, setLocation] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [extraImagePreviews, setExtraImagePreviews] = useState([null, null, null, null]);
  const [modalImage, setModalImage] = useState(null);
  const [sameProvinceShops, setSameProvinceShops] = useState([]);
  const [sameProvinceGuides, setSameProvinceGuides] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentLocations, setLocations] = useState([])
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [places,setPlaces] =useState([]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "star filled" : "star"}>
          {i < rating ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    async function fetchLocation() {
      try {
        const response = await axios.get(`http://localhost:8080/locations/${id}`);
        const data = response.data;

        setLocation(data.location);
        setShortDescription(data.shortDescription);
        setLongDescription(data.longDescription);
        setMainImagePreview(data.mainImage);
        setExtraImagePreviews([data.extraImage1, data.extraImage2, data.extraImage3, data.extraImage4]);
        setCoordinates({ lat: data.latitude, lng: data.longitude });

        // Fetch shops from the same province
        const province = data.province;
        const shopsResponse = await axios.get(
          `http://localhost:8080/Shops/searchByProvince?province=${province}`
        );
        setSameProvinceShops(shopsResponse.data);

        // Fetch guides from the same province
        const guidesResponse = await axios.get(
          `http://localhost:8080/api/guides/searchByProvince?province=${province}`
        );
        setSameProvinceGuides(guidesResponse.data);
      } catch (error) {
        console.error("Error fetching location details:", error.message);
        alert("Failed to fetch location details.");
      }
    }

    fetchLocation();
  }, [id]);

  // Fetch usernames for reviews
  const fetchUsernames = async (reviews) => {
    try {
      const userIds = reviews.map((review) => review.userId); // Extract user IDs
      const response = await axios.post("http://localhost:8080/api/users/getUsernames", userIds, {
        headers: { "Content-Type": "application/json" },
      });
      const userMap = response.data; // { userId: username }
      return reviews.map((review) => ({
        ...review,
        username: userMap[review.userId] || "Anonymous", // Map usernames
      }));
    } catch (error) {
      console.error("Error fetching usernames:", error.message);
      return reviews; // Fallback to reviews without usernames
    }
  };
  

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:8080/locations/${id}`);
        let reviewsData = response.data.placeReviewList;
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error loading reviews:", error.message);
        alert("Failed to load reviews.");
      }
    }

    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!coordinates) return;
      const weatherApiKey = "0c7967b080d377c47ea3e4eec45a9736";

      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${weatherApiKey}&units=metric`
        );
        const weatherData = await weatherResponse.json();
        setCurrentWeather(weatherData);

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${weatherApiKey}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        setHourlyForecast(forecastData.list.slice(0, 8));
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [coordinates]);

  const openImage = (image) => setModalImage(image);
  const closeModal = () => setModalImage(null);

  return (
    <div>
      <div className="locationView">
        <div className="locationPlatter container">
          <div className="locationPlatter-text">
            <h1>{location}</h1>
            <p>{shortDescription}</p>
          </div>
          <div className="photo-grid">
            <div className="main-image">
              {mainImagePreview && <img src={mainImagePreview} alt="Main" onClick={() => openImage(mainImagePreview)} />}
            </div>
            <div className="side-images">
              {extraImagePreviews.map((img, index) =>
                img ? <img key={index} src={img} alt={`Extra ${index + 1}`} onClick={() => openImage(img)} /> : null
              )}
            </div>
          </div>
        </div>
        <div className="main-container">
          <div className="description-container">
            <p>{longDescription}</p>
          </div>
          <div className="api-container">
            <div className="map">
              <h2 className="header">Location Map</h2>
              {coordinates ? (
                <iframe
                  title="Google Map"
                  className="map-preview"
                  src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBnoSZiGiahM3iiUAGCFyDyWj73vl_INjk&center=${coordinates.lat},${coordinates.lng}&zoom=12`}
                ></iframe>
              ) : (
                <p className="info">No map available. Please provide location coordinates.</p>
              )}
            </div>
            <div className="weather">
              <h2 className="header">Current Weather</h2>
              {currentWeather ? (
                <div className="current-weather">
                  <div className="weather-header">
                    <img
                      src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                      alt="Weather Icon"
                    />
                    <h1>{Math.round(currentWeather.main.temp)}°C</h1>
                  </div>
                  <p>{currentWeather.weather[0].description}</p>
                  <p>Wind: {currentWeather.wind.speed} m/s</p>
                  <p>Humidity: {currentWeather.main.humidity}%</p>
                </div>
              ) : (
                <p className="info">No weather data available. Please select a location.</p>
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
              {sameProvinceShops.length > 0 ? (
                sameProvinceShops.slice(0, 4).map((shop, index) => (
                  <Link key={index} to={`/shopView/${shop.id}`}>
                    <div className="shopTile">
                      <img src={shop.image || Lamborghini} alt={shop.name} className="tile-img" />
                      <div className="tile-content">
                        <h3>{shop.name}</h3>
                        <p>{shop.description || "No description available."}</p>
                        <div className="star-rating">{renderStars(shop.rating || 3)}</div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No Shops Found</p>
              )}
            </div>
            {sameProvinceShops.length > 4 && (
              <button className="view-more-button">View More Shops</button>
            )}
          </div>


          <div className="reviews-container">
            <h2>Location Reviews</h2>
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
            <Link to={`/locationReview/${id}`}>
              <button className="view-more-button">Add Location Review</button>
            </Link>
            <Link to={`/userLocationReview/${id}`}>
              <button className="view-more-button">My Location Reviews</button>
            </Link>
          </div>

          {modalImage && (
            <div className="modal">
              <div className="modal-content">
                <button className="close-button" onClick={closeModal}>
                  &times;
                </button>
                <img src={modalImage} alt="Modal View" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationView;
