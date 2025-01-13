import React, { useState, useEffect } from "react";
import "./LocationsList.css";
import NarangalaImage from "../../Assets/Narangala_1.jpg";
import axios from "axios";
import { Link } from 'react-router-dom';

const LocationsList = () => {
    const itemsPerPage = 15;
    const [locations, setLocations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredLocations, setFilteredLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get("http://localhost:8080/locations");
                setLocations(response.data);
                setFilteredLocations(response.data); // Initially set all locations as filtered
            } catch (error) {
                console.error("Error Fetching Locations:", error);
            }
        };

        fetchLocations();
    }, []);

    // Handle search query changes
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = locations.filter(location =>
            location.location.toLowerCase().includes(query) // Filter by location name only
        );
        setFilteredLocations(filtered);
        setCurrentPage(1); // Reset to the first page after search
    };

    const indexOfLastLocation = currentPage * itemsPerPage;
    const indexOfFirstLocation = indexOfLastLocation - itemsPerPage;
    const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

    const shouldMovePaginationToBottom = currentLocations.length < itemsPerPage;

    return (
        <div className="locationsListContainer">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search for a location..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-bar"
                />
            </div>

            <div className="locationsList">
                {currentLocations.length > 0 ? (
                    currentLocations.map((location, index) => (
                        <Link key={index} to={`/locationView/${location.id}`}>
                            <div className="locationTile">
                                <img src={location.image || NarangalaImage} alt={location.name} className="tile-img" />
                                <div className="tile-content">
                                    <h3>{location.location}</h3>
                                    <p>{location.shortDescription}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No Locations Found</p>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredLocations.length > itemsPerPage && (
                <div className={`pagination-wrapper ${shouldMovePaginationToBottom ? 'move-pagination' : ''}`}>
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            Prev
                        </button>

                        {[...Array(totalPages).keys()].map(pageNumber => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber + 1)}
                                className={`pagination-btn ${currentPage === pageNumber + 1 ? "active" : ""}`}
                            >
                                {pageNumber + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationsList;