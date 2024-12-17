import React from "react";
import "./ManageRequests.css";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import RequestsTable from "../../Components/RequestsTable/RequestsTable";

const ManageRequests = () => {
  return (
    <div className="manageRequests">
      <AdminSidebar/>
      <div className="manageRequestsContainer">
        <AdminNavbar/>
        <RequestsTable/>
      </div>
    </div>
  );
};

export default ManageRequests;