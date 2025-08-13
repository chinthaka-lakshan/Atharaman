import React from "react";
import "./AdminWidget.css";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import ElderlySharpIcon from '@mui/icons-material/ElderlySharp';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import ReviewsSharpIcon from '@mui/icons-material/ReviewsSharp';
import { Link } from 'react-router-dom';

const AdminWidget = ({ type }) => {

  let data;

  switch (type) {
    case "locations":
      data = {
        title: "LOCATIONS",
        isMoney: false,
        link: <Link to="/manageLocations" style={{textDecoration:"none", color:"#425060"}}><span>View All Locations</span></Link>,
        icon: (
          <LocationOnSharpIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "#ff000033" }}
          />
        ),
      };
      break;

    case "guides":
      data = {
        title: "GUIDES",
        isMoney: false,
        link: <Link to="/manageGuides" style={{textDecoration:"none", color:"#425060"}}><span>View All Guides</span></Link>,
        icon: (
          <ElderlySharpIcon
            className="icon"
            style={{ color: "purple", backgroundColor: "#80008033" }}
          />
        ),
      };
      break;

    case "shops":
      data = {
        title: "SHOPS",
        isMoney: false,
        link: <Link to="/manageShops" style={{textDecoration:"none", color:"#425060"}}><span>View All Shops</span></Link>,
        icon: (
          <ShoppingCartSharpIcon
            className="icon"
            style={{ color: "goldenrod", backgroundColor: "#daa52033" }}
          />
        ),
      };
      break;

    case "reviews":
      data = {
        title: "REVIEWS",
        isMoney: false,
        link: <Link to="/manageReviews" style={{textDecoration:"none", color:"#425060"}}><span>View All Reviews</span></Link>,
        icon: (
          <ReviewsSharpIcon
            className="icon"
            style={{ color: "green", backgroundColor: "#00800033" }}
          />
        ),
      };
      break;

    default:
      break;
  }

  return (
    <div className='widget'>
      <div className='left'>
        <span className='title'>{data.title}</span>
      </div>
      <div className='right'>
        {data.icon}
        <span className='link'>{data.link}</span>
      </div>
    </div>
  );
};

export default AdminWidget;