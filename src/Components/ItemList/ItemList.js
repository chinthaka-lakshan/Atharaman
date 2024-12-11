import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./ItemList.css";

const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
            {i < rating ? "★" : "☆"}
        </span>
    ));
};

const ItemList = () => {
    const itemsPerPage = 15;

    const [items, setItems] = useState([]); // State to hold fetched items
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:8080/item/get-all"); // Directly call the API
                setItems(response.data); // Store the fetched data in state
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div className="itemList">
            {currentItems.map((item) => (
                <Link key={item.id} to={`/ViewItem/${item.id}`}>
                    <div className="itemTile">
                        <img
                            src={`data:image/jpeg;base64,${item.image}`} // Display Base64 image
                            alt={item.name}
                            className="tile-img"
                        />
                        <div className="tile-content">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <div className="star-rating">{renderStars(item.rating)}</div>
                        </div>
                    </div>
                </Link>
            ))}

            {/* Pagination Controls */}
            {items.length > itemsPerPage && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages).keys()].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                        >
                            {i + 1}
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
            )}
        </div>
    );
};

export default ItemList;