import React from "react";
import "./AdminDashboard.css";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import AdminWidget from "../../Components/AdminWidget/AdminWidget";

const AdminDashboard = () => {
  return (
    <div className="adminDashboard">
      <AdminSidebar/>
      <div className="adminDashboardContainer">
        <AdminNavbar/>
        <div className="adminWidgets">
          <AdminWidget type="locations"/>
          <AdminWidget type="guides"/>
          <AdminWidget type="shops"/>
          <AdminWidget type="reviews"/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;