import React, { useState, useEffect } from "react";
import "./GuidesList.css";
import SachinthaJayaweera from "../../Assets/SachinthaJayaweera_1.jpg";
import axios from "axios";
import { Link } from 'react-router-dom';

const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars.push(<span key={i} className="star filled">★</span>);
        } else {
            stars.push(<span key={i} className="star">☆</span>);
        }
    }
    return stars;
};

const GuidesList = () => {
    const itemsPerPage = 15;
    const [guides, setGuides] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await axios.get("http://localhost:8080/guides");
                setGuides(response.data);
            } catch (error) {
                console.error("Error Fetching Guides:", error);
            }
        };

        fetchGuides();
    }, []);

    const indexOfLastGuide = currentPage * itemsPerPage;
    const indexOfFirstGuide = indexOfLastGuide - itemsPerPage;
    const currentGuides = guides.slice(indexOfFirstGuide, indexOfLastGuide);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(guides.length / itemsPerPage);

    const shouldMovePaginationToBottom = currentGuides.length < itemsPerPage;

    return (
        <div className="guidesList">
            {currentGuides.length > 0 ? (
                currentGuides.map((guide, index) => (
                    <Link key={index} to={`/guideView/${guide.id}`}>
                        <div className="guideTile">
                            <img src={guide.image || SachinthaJayaweera} alt={guide.name} className="tile-img"/>
                            <div className="tile-content">
                                <h3>{guide.guide}</h3>
                                <p>{guide.shortDescription}</p>
                                {/* Render star rating */}
                                <div className="star-rating">
                                    {renderStars(guide.rating || 3)} {/* Assuming rating is a number between 1-5 */}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p>No Guides Found</p>
            )}

            {/* Pagination Controls */}
            {guides.length > itemsPerPage && (
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