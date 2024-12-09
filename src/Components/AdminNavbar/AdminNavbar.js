import React from "react";
import "./AdminNavbar.css";
import SachinthaRashen from "../../Assets/SachinthaRashen_1.jpg";

const AdminNavbar = () => {
  return (
    <div className="adminNavbar">
      <div className="adminNavbarContainer">
        <span>ADMIN DASHBOARD</span>
        <div className="item">
          <img src={SachinthaRashen} alt="" className="profileImg"/>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;