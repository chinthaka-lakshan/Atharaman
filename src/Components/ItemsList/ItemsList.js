import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./ItemsList.css";

const ItemsList = () => {
    const itemsPerPage = 15;
    const [items, setItems] = useState([]); // State to hold fetched items
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:8080/item/get-all"); // Directly call the API
                setItems(response.data); // Store the fetched data in state
                setFilteredItems(response.data); // Initially set all items as filtered
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

    // Handle search query changes
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(query) // Filter by item name only
        );
        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to the first page after search
    };
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const shouldMovePaginationToBottom = currentItems.length < itemsPerPage;

    return (
        <div className="itemsListContainer">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search for an item..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-bar"
                />
            </div>

            <div className="itemsList">
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <Link key={index} to={`/itemView/${item.id}`}>
                            <div className="itemTile">
                                <img
                                    src={`data:image/jpeg;base64,${item.image}`} // Display Base64 image
                                    alt={item.name}
                                    className="tile-img"
                                />
                                <div className="tile-content">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No Items Found</p>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredItems.length > itemsPerPage && (
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

export default ItemsList;