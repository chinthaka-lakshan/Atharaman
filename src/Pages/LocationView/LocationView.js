// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "./LocationView.css";
// import Narangala from "../../Assets/Narangala_1.jpg";
// import SachinthaJayaweera from '../../Assets/SachinthaJayaweera_1.jpg'
// import Lamborghini from '../../Assets/Lamborghini_1.jpg'
// import { Link } from 'react-router-dom';
// import axios from "axios";

// const LocationView = () => {
//   const { id } = useParams();
//   const [location, setLocation] = useState("");
//   const [shortDescription, setShortDescription] = useState("");
//   const [longDescription, setLongDescription] = useState("");
//   const [mainImagePreview, setMainImagePreview] = useState(null);
//   const [extraImagePreviews, setExtraImagePreviews] = useState([null, null, null, null]);
  

//   const [weather, setWeather] = useState(null);
//   const [modalImage, setModalImage] = useState(null);
//   const [currentLocations, setLocations] = useState([])
//   const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your OpenWeatherMap API Key
//   const latitude = 7.1167; // Latitude of Narangala
//   const longitude = 81.0333; // Longitude of Narangala

//   const [reviews, setReviews] = useState([]);

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 0; i < 5; i++) {
//       if (i < rating) {
//         stars.push(<span key={i} className="star filled">★</span>); // filled star
//       } else {
//         stars.push(<span key={i} className="star">☆</span>); // empty star
//       }
//     }
//     return stars;
//   };

//   useEffect(() => {
//     async function fetchLocation() {
//       try {
//         const response = await axios.get(`http://localhost:8080/locations/${id}`);
//         const data = response.data;
//         setLocation(data.location);
//         setShortDescription(data.shortDescription);
//         setLongDescription(data.longDescription);
//         setMainImagePreview(data.mainImage);
//         setExtraImagePreviews([data.extraImage1, data.extraImage2, data.extraImage3, data.extraImage4]);
//       } catch (error) {
//         console.error("Error fetching location details:", error.message);
//         alert("Failed to fetch location details.");
//       }
//     }

//     async function fetchReviews() {
//       try {
//         const response = await axios.get('http://localhost:8080/placereview');
//         setReviews(response.data);
//       } catch (error) {
//         console.error('Error loading reviews:', error);
//       }
//     }

//     fetchLocation();
//     fetchReviews();
//   }, [id]);

//   useEffect(() => {
//     const fetchWeather = async () => {
//       try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
//         const data = await response.json();
//         setWeather(data);
//       } catch (error) {
//         console.error("Error fetching weather data:", error);
//       }
//     };
//     fetchWeather();
//   }, []);

//   const openImage = (image) => {
//     setModalImage(image);
//   };

//   const closeModal = () => {
//     setModalImage(null);
//   };

//   return (
//     <div>
//       <div className="locationView">
//         <div className="locationPlatter container">
//           <div className="locationPlatter-text">
//             <h1>{location}</h1>
//             <p>{shortDescription}</p>
//           </div>
//           <div className="photo-grid">
//             <div className="main-image">
//               {mainImagePreview && <img src={mainImagePreview} alt="Main" onClick={() => openImage(mainImagePreview) }/>}
//             </div>
//             <div className="side-images">
//               {extraImagePreviews.map((img, index) =>
//                 img ? <img key={index} src={img} alt={`Extra ${index + 1}`} onClick={() => openImage(img) }/> : null
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="main-container">
//           <div className="description-container">
//             <p>{longDescription}</p>
//           </div>
//           <div className="side-info">
//             <div className="map-view">
//               <h2>Location Map</h2>
//               <iframe
//                 title="Narangala Map"
//                 src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${latitude},${longitude}`}
//                 width="100%"
//                 height="300"
//                 style={{ border: "0" }}
//                 allowFullScreen
//               ></iframe>
//             </div>
//             <div className="weather-view">
//               <h2>Current Weather</h2>
//               {weather && weather.main && weather.weather ? (
//                 <div>
//                   <p>
//                     <strong>Temperature:</strong> {weather.main.temp}°C
//                   </p>
//                   <p>
//                     <strong>Condition:</strong> {weather.weather[0].description}
//                   </p>
//                   <p>
//                     <strong>Humidity:</strong> {weather.main.humidity}%
//                   </p>
//                   <p>
//                     <strong>Wind Speed:</strong> {weather.wind.speed} m/s
//                   </p>
//                 </div>
//               ) : (
//               <p>Loading weather information...</p>
//               )}
//             </div>
//           </div>
//           <div className="guides-container">
//             <h2>Top Guides Nearby</h2>
//             <div className="guides-list">
//               {currentLocations.length > 0 ? (
//                 currentLocations.slice(0, 4).map((location, index) => (
//                   <Link key={index} to={`/locationView/${location.id}`}>
//                     <div className="guideTile">
//                       <img src={location.image || SachinthaJayaweera} alt={location.name} className="tile-img" />
//                         <div className="tile-content">
//                           <h3>{location.location}</h3>
//                           <p>{location.shortDescription}</p>
//                           <div className="star-rating">
//                             {renderStars(location.rating || 3)}
//                           </div>
//                         </div>
//                     </div>
//                   </Link>
//                 ))
//               ) : (
//               <p>No Guides Found</p>
//               )}
//             </div>
//             <button className="view-more-button">View More Guides</button>
//           </div>
//           <div className="shops-container">
//             <h2>Top Shops Nearby</h2>
//             <div className="shops-list">
//               {currentLocations.length > 0 ? (
//                 currentLocations.slice(0, 4).map((location, index) => (
//                   <Link key={index} to={`/locationView/${location.id}`}>
//                     <div className="shopTile">
//                       <img src={location.image || Lamborghini} alt={location.name} className="tile-img" />
//                         <div className="tile-content">
//                           <h3>{location.location}</h3>
//                           <p>{location.shortDescription}</p>
//                           <div className="star-rating">
//                             {renderStars(location.rating || 3)}
//                           </div>
//                         </div>
//                     </div>
//                   </Link>
//                 ))
//               ) : (
//               <p>No Shops Found</p>
//               )}
//             </div>
//             <button className="view-more-button">View More Shops</button>
//           </div>
//           <div className="reviews-container">
//             <h2>Location Reviews</h2>
//             <div className="reviews-list">
//               {reviews.length > 0 ? (
//                 reviews.map((review, index) => (
//                   <div key={index} className="reviewTile">
//                     <div className="review-header">
//                       <h3>Sachintha</h3>
//                       <div className="star-rating">{renderStars(review.rating)}</div>
//                     </div>
//                     <p className="review-comment">{review.comment}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No Reviews Found</p>
//               )}
//             </div>
//             <Link to="/locationReview">
//               <button className="view-more-button">Add Location Review</button>
//             </Link>
//           </div>
//           {modalImage && (
//             <div className="modal">
//               <div className="modal-content">
//                 <button className="close-button" onClick={closeModal}>
//                   &times;
//                 </button>
//                 <img src={modalImage} alt="Enlarged view" />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationView;




// import React, { useState } from 'react';
// import './LocationView.css';

// const LocationView = () => {
//   const [coordinates, setCoordinates] = useState(null);
//   const [currentWeather, setCurrentWeather] = useState(null);
//   const [hourlyForecast, setHourlyForecast] = useState([]);
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');

//   const handleLocationSelect = async () => {
//     const weatherApiKey = '0c7967b080d377c47ea3e4eec45a9736';

//     try {
//       // Validate input
//       if (!latitude || !longitude) {
//         alert('Please provide valid latitude and longitude.');
//         return;
//       }

//       const lat = parseFloat(latitude);
//       const lng = parseFloat(longitude);

//       // Set coordinates
//       setCoordinates({ lat, lng });

//       // Fetch current weather
//       const weatherResponse = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric`
//       );
//       const weatherData = await weatherResponse.json();
//       setCurrentWeather(weatherData);

//       // Fetch hourly forecast
//       const forecastResponse = await fetch(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric`
//       );
//       const forecastData = await forecastResponse.json();
//       setHourlyForecast(forecastData.list.slice(0, 8)); // Next 8 time slots (24 hours)
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   return (
//     <div className="app-container">
//       {/* Input Section for Latitude and Longitude */}
//       <div className="input-section">
//         <h2>Enter Location Coordinates</h2>
//         <div className="coordinate-inputs">
//           <input
//             type="text"
//             placeholder="Latitude"
//             value={latitude}
//             onChange={(e) => setLatitude(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Longitude"
//             value={longitude}
//             onChange={(e) => setLongitude(e.target.value)}
//           />
//           <button onClick={handleLocationSelect}>Show Weather and Map</button>
//         </div>
//       </div>

//       {/* Left Section */}
//       <div className="left-section">
//         {/* Current Weather */}
//         <div className="boxed-frame">
//           <h2 className="header">Current Weather</h2>
//           {currentWeather ? (
//             <div className="current-weather">
//               <div className="weather-header">
//                 <img
//                   src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
//                   alt="Weather Icon"
//                 />
//                 <h1>{Math.round(currentWeather.main.temp)}°C</h1>
//               </div>
//               <p>{currentWeather.weather[0].description}</p>
//               <p>Wind: {currentWeather.wind.speed} m/s</p>
//               <p>Humidity: {currentWeather.main.humidity}%</p>
//             </div>
//           ) : (
//             <p className="info">No weather data available. Please select a location.</p>
//           )}
//         </div>

//         {/* Hourly Forecast */}
//         <div className="boxed-frame">
//           <h2 className="header">Hourly Forecast</h2>
//           <div className="hourly-forecast">
//             {hourlyForecast.map((forecast, index) => (
//               <div key={index} className="hour-card">
//                 <p>{new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//                 <img
//                   src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
//                   alt="Weather Icon"
//                 />
//                 <p>{Math.round(forecast.main.temp)}°C</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="right-section">
//         <div className="boxed-frame">
//           <h2 className="header">Location Map</h2>
//           {coordinates ? (
//             <iframe
//               title="Google Map"
//               className="map-preview"
//               src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBnoSZiGiahM3iiUAGCFyDyWj73vl_INjk&center=${coordinates.lat},${coordinates.lng}&zoom=12`}
//             ></iframe>
//           ) : (
//             <p className="info">No map available. Please provide location coordinates.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationView;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./LocationView.css";
import Narangala from "../../Assets/Narangala_1.jpg";
import SachinthaJayaweera from '../../Assets/SachinthaJayaweera_1.jpg'
import Lamborghini from '../../Assets/Lamborghini_1.jpg'
import { Link } from 'react-router-dom';
import axios from "axios";

const LocationView = () => {
  const { id } = useParams();
  const [location, setLocation] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [extraImagePreviews, setExtraImagePreviews] = useState([null, null, null, null]);
  const [modalImage, setModalImage] = useState(null);
  const [currentLocations, setLocations] = useState([])
  const [reviews, setReviews] = useState([]);

  const [coordinates, setCoordinates] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);

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
      } catch (error) {
        console.error("Error fetching location details:", error.message);
        alert("Failed to fetch location details.");
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

    fetchLocation();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!coordinates) return;
      const weatherApiKey = '0c7967b080d377c47ea3e4eec45a9736';

      try {
        // Fetch current weather
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${weatherApiKey}&units=metric`
        );
        const weatherData = await weatherResponse.json();
        setCurrentWeather(weatherData);

        // Fetch hourly forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${weatherApiKey}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        setHourlyForecast(forecastData.list.slice(0, 8)); // Next 8 time slots (24 hours)
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [coordinates]);

  const openImage = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

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
            <p>{longDescription}</p>
          </div>

          {/* Weather and Map Section */}
          <div className="app-container">
            {/* Left Section */}
            <div className="left-section">
              {/* Current Weather */}
              <div className="boxed-frame">
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

              {/* Hourly Forecast */}
              <div className="boxed-frame">
                <h2 className="header">Hourly Forecast</h2>
                <div className="hourly-forecast">
                  {hourlyForecast.map((forecast, index) => (
                    <div key={index} className="hour-card">
                      <p>{new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                        alt="Weather Icon"
                      />
                      <p>{Math.round(forecast.main.temp)}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="right-section">
              <div className="boxed-frame">
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
            <Link to="/locationReview">
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
