import React from "react";
import "./ManageGuides.css";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import GuidesTable from "../../Components/GuidesTable/GuidesTable";
const ManageGuides = () => {
  return (
    <div className="manageGuides">
      <AdminSidebar/>
      <div className="manageGuidesContainer">
        <AdminNavbar/>
        <GuidesTable/>
      </div>
    </div>
  );
};

export default ManageGuides;