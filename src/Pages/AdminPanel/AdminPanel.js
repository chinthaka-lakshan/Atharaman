import React from "react";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import Widget from "../../Components/Widget/Widget";
import "./AdminPanel.css";

const AdminPanel = () => {
  return (
    <div className="home">
      <>
        <AdminSidebar />
        <div className="homeContainer">
          <AdminNavbar />
          <div className="widgets">
            <Widget type="customer" />
            <Widget type="order" />
            <Widget type="earnings" />
            <Widget type="balance" />
          </div>
        </div>
      </>
    </div>
  );
};

export default AdminPanel;