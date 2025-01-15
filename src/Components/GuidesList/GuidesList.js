import React, { useState, useEffect } from "react";
import "./GuidesList.css";
import SachinthaJayaweera from "../../Assets/SachinthaJayaweera_1.jpg";
import axios from "axios";
import { Link } from 'react-router-dom';

const GuidesList = () => {
    const itemsPerPage = 15;
    const [guides, setGuides] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGuides, setFilteredGuides] = useState([]);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/guides");
                setGuides(response.data);
                setFilteredGuides(response.data); // Initially set all guides as filtered
            } catch (error) {
                console.error("Error Fetching Guides:", error);
            }
        };

        fetchGuides();
    }, []);

    // Handle search query changes
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = guides.filter(guide =>
            guide.name && guide.name.toLowerCase().includes(query) // Ensure guideName is defined
        );
        setFilteredGuides(filtered);
        setCurrentPage(1); // Reset to the first page after search
    };
    

    const indexOfLastGuide = currentPage * itemsPerPage;
    const indexOfFirstGuide = indexOfLastGuide - itemsPerPage;
    const currentGuides = filteredGuides.slice(indexOfFirstGuide, indexOfLastGuide);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);

    const shouldMovePaginationToBottom = currentGuides.length < itemsPerPage;

    return (
        <div className="guidesListContainer">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search for a guide..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-bar"
                />
            </div>

            <div className="itemsList">
                {currentGuides.length > 0 ? (
                    currentGuides.map((guide, index) => (
                        <Link key={index} to={`/guideView/${guide.id}`}>
                            <div className="itemTile">
                                <img
                                    src={guide.image || SachinthaJayaweera}
                                    alt={guide.name}
                                    className="tile-img"
                                />
                                <div className="tile-content">
                                    <h3>{guide.name}</h3>
                                    <p>{guide.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No Items Found</p>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredGuides.length > itemsPerPage && (
                <div className={`pagination-wrapper ${shouldMovePaginationToBottom ? 'move-pagination' : ''}`}>
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            Prev
                        </button>

                        {/* Render page buttons */}
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

export default GuidesList;