import React, { useState, useEffect } from "react";
import "./places.css";
import NarangalaImage from "../../Assets/Narangala_1.jpg"; // Import the image from assets folder
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"; // Import Google Maps components
import axios from "axios"; // Import axios
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const App = () => {
  // List of provinces in Sri Lanka
  const provinces = [
    "All",
    "Badulla",
    "Monaragala",
    "Nuwara Eliya",
    "Kandy",
    "Matale",
    "Hambantota",
    "Galle",
    "Ratnapura",
  ];

  const [places, setPlaces] = useState([]); // State to hold places fetched from the API
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 5;

  // Fetch places from the Spring Boot API when the component mounts
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("http://localhost:8080/atharaman"); // Update the URL based on your backend
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, []); // Empty dependency array ensures this runs once on component mount

  // Other existing code remains unchanged...
  const totalPages = Math.ceil(places.length / placesPerPage);

  // Add any other functions you have here (filtering, pagination, etc.)
  const handleViewPlace = (place) => {
    // Implement your logic here, e.g., navigate to a detail page or show a modal
    console.log("View place details:", place);
  };
  
  

return (
  <div className="results">
    {places.length > 0 ? (
      places.map((place, index) => (
        <div key={index} className="card">
          <img src={place.image || NarangalaImage} alt={place.name} className="card-img" />
          <div className="card-content">
            <h3>{place.location}</h3>
            <p>{place.shortDescription}</p>
            <div className="stars">{"★".repeat(place.stars)}</div>
            {/* Link for the View button */}
            <Link to={`/placeView`} className="view-button">View</Link>
          </div>
        </div>
      ))
    ) : (
      <p>No places found.</p>
    )}
  </div>
);

  
  
};

export default App;

