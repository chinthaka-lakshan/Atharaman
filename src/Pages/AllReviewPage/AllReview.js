import React, { useState } from 'react';
import './AllReview.css';

const AllReview = () => {
    const [reviews, setReviews] = useState([
        { id: 1, name: "John Doe", rating: 5, comment: "Amazing experience, highly recommend!" },
        { id: 2, name: "Jane Smith", rating: 4, comment: "Great place, but the facilities could be better." },
        { id: 3, name: "Alex Brown", rating: 5, comment: "Absolutely loved it! Will visit again." },
        { id: 4, name: "Emma Wilson", rating: 3, comment: "Decent, but not as expected." },
        { id: 5, name: "Michael Clark", rating: 4, comment: "Nice and cozy environment." },
        { id: 6, name: "Sophia Turner", rating: 5, comment: "Perfect for a weekend getaway!" },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 3;

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    // Pagination logic
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="all-review-container">
            <h1>All Reviews</h1>
            <div className="reviews-list">
                {currentReviews.map((review) => (
                    <div className="review-card" key={review.id}>
                        <h3>{review.name}</h3>
                        <div className="rating">
                            {Array.from({ length: review.rating }, (_, i) => (
                                <span key={i} className="star">★</span>
                            ))}
                        </div>
                        <p>{review.comment}</p>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button
                    className="pagination-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllReview;
