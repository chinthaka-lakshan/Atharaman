import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ReviewsTable.css";
import { Link } from "react-router-dom";
import { fetchUsernames } from "../../services/Api"; // Import the function
import axios from "axios";

const ReviewsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch raw reviews from the backend
        const response = await axios.get("http://localhost:8080/review");
        const enrichedReviews = await fetchUsernames(response.data); // Enrich with usernames
        setData(enrichedReviews); // Set the enriched reviews data
      } catch (error) {
        console.error("Error fetching review data", error);
      }
    };

    fetchReviews();
  }, []);

  const reviewColumns = [
    { field: "id", headerName: "Review ID", width: 100 },
    { field: "userName", headerName: "UserName", width: 200 }, // Username column
    { field: "comment", headerName: "Comment", width: 400 },

    { field: "id", headerName: "Review ID", width: 70 },
    { field: "userName", headerName: "Username", width: 200 }, // Username column
    { field: "comment", headerName: "Comment", width: 460 },

    { field: "rating", headerName: "Rating", width: 140 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/viewReview/${params.row.id}`}>
            {/* <button className="viewButton">View</button> */}
          </Link>
          <button
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the review?`
    );

    if (!userConfirmed) {
      alert("Deletion canceled.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/review/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
      alert(`Review with ID ${id} has been successfully deleted.`);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(
        `Failed to delete review with ID ${id}. ${
          error.response?.data?.message || "Please try again later."
        }`
      );
    }
  };

  return (
    <div className="reviewsTable">
      <div className="reviewsTableTitle">
        <span>Reviews List</span>
      </div>
      <DataGrid
        className="dataGrid"
        rows={data}
        columns={reviewColumns.concat(actionColumn)}
        pageSize={8}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default ReviewsTable;