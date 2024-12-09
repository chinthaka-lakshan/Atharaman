import React from "react";
import "./ManageShops.css";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import ShopsTable from "../../Components/ShopsTable/ShopsTable";

const ManageShops = () => {
  return (
    <div className="manageShops">
      <AdminSidebar/>
      <div className="manageShopsContainer">
        <AdminNavbar/>
        <ShopsTable/>
      </div>
    </div>
  );
};

export default ManageShops;