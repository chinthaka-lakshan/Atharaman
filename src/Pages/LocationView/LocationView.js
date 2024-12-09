import React, { useState, useEffect } from "react";
import "./LocationView.css";
import Navbar from "../../Components/Navbar/Navbar";
import Narangala from "../../Assets/Narangala_1.jpg";
import SachinthaJayaweera from '../../Assets/SachinthaJayaweera_1.jpg'
import Lamborghini from '../../Assets/Lamborghini_1.jpg'

const LocationView = () => {
  const [weather, setWeather] = useState(null);
  const [modalImage, setModalImage] = useState(null); // State for modal
  const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your OpenWeatherMap API Key
  const latitude = 7.1167; // Latitude of Narangala
  const longitude = 81.0333; // Longitude of Narangala

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, []);

  const openImage = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div>
      <Navbar />
      <div className="locationPlatter container">
        <div className="locationPlatter-text">
          <h1>Narangala</h1>
          <p>
            Narangala Mountain is a 1,521-meter peak in the Uva Province with
            scenic views and diverse wildlife. Learn about its history, trails,
            and how to visit this remote and rugged place.
          </p>
        </div>
        <div className="photo-grid">
          {/* Main Image */}
          <img
            src={Narangala}
            alt="Main view"
            className="main-image"
            onClick={() => openImage(Narangala)}
          />
          {/* Gallery Images */}
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
        <div className="main-container">
          {/* Description Section */}
          <div className="description-container">
            <p>
              Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m (1527 m). There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight. As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills. Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m (1527 m). There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight. As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills. Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m (1527 m). There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight.
              As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills.
            </p>
          </div>
          {/* Weather and Map Section */}
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
        </div>
      </div>
      <div className="guides-container">
        <h2>Top Guides Nearby</h2>
        <div className="guides-list">
          {[1, 2, 3, 4].map((_, index) => (
            <div className="guide-card" key={index}>
              <img
                src={SachinthaJayaweera}  // Replace with guide image URLs
                alt={`Guide ${index + 1}`}
                className="guide-photo"
              />
              <div className="guide-info">
                <h3>Guide Name {index + 1}</h3>
                <p>
                  This is a short description about the guide. They are experienced
                  and know the area well.
                </p>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star, i) => (
                    <span
                      key={i}
                      className={`star ${i < 4 ? "filled" : ""}`} // Adjust "4" based on rating
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="view-more-button">View More Guides</button>
      </div>

      {/* Top Shops Nearby Section */}
      <div className="shops-container">
        <h2>Top Shops Nearby</h2>
        <div className="shops-list">
          {[1, 2, 3, 4].map((_, index) => (
            <div className="shop-card" key={index}>
              <img
                src={Lamborghini} // Replace with shop image URLs
                alt={`Shop ${index + 1}`}
                className="shop-photo"
              />
              <div className="shop-info">
                <h3>Shop Name {index + 1}</h3>
                <p>
                  This is a short description about the shop.
                </p>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star, i) => (
                    <span
                      key={i}
                      className={`star ${i < 4 ? "filled" : ""}`} // Adjust "4" based on rating
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="view-more-button">View More Shops</button>
      </div>

      {/* Modal for Enlarged Image */}
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
  );
  

};

export default LocationView;