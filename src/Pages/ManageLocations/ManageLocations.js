import React from "react";
import "./ManageLocations.css";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import LocationsTable from "../../Components/LocationsTable/LocationsTable";

const ManageLocations = () => {
  return (
    <div className="manageLocations">
      <AdminSidebar/>
      <div className="manageLocationsContainer">
        <AdminNavbar/>
        <LocationsTable/>
      </div>
    </div>
  );
};

export default ManageLocations;