import React from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      

      {/* Hero Section */}
      <div className="hero-section">
        {/* Left Text Content */}
        <div className="hero-text">
          <p className="greeting">Hello</p>
          <h1>
            I'm <span className="highlight">Mitchell</span>
          </h1>
          <p className="email">mithchell@gmail.com</p>
          <p className="Experience">
            Welcome to my web developer portfolio! I'm Mitchell, a skilled and
            creative web developer with a passion for creating beautiful,
            responsive, and user-friendly websites. I've worked on a variety of
            web projects, ranging from personal blogs to e-commerce platforms.
          </p>
          <p className="place">Camping Place :Ella</p>
          <p className="Nic">Nic:356576876</p>
          <p className="Contact">Contact:0750118009</p>
          
        </div>

        {/* Right Profile Image */}
        <div className="hero-image">
          <img
            src="https://via.placeholder.com/300"
            alt="Mitchell"
            className="profile-picture"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
