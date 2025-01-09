import React from "react";
import "./ManageReviews.css";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import ReviewsTable from "../../Components/ReviewsTable/ReviewsTable";

const ManageReviews = () => {
  return (
    <div className="manageReviews">
      <AdminSidebar/>
      <div className="manageReviewsContainer">
        <AdminNavbar/>
        <ReviewsTable/>
      </div>
    </div>
  );
};

export default ManageReviews;