import React from 'react';
import "./AdminSidebar.css";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import ElderlySharpIcon from '@mui/icons-material/ElderlySharp';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import ReviewsSharpIcon from '@mui/icons-material/ReviewsSharp';
import { Link } from 'react-router-dom';
import Logo from '../../Assets/Logo.jpg'

const AdminSidebar = () => {
  return (
    <div className='adminSidebar'>
        <div className='top'>
            <Link to="/" style={{textDecoration:"none"}}>
                <img src={Logo} alt='' className='logo'/>
            </Link>
        </div>
        <hr/>
        <div className='bottom'>
            <ul>
                <p className='title'></p>

                <Link to="/adminPanel" style={{textDecoration:"none"}}>
                    <li>
                        <DashboardIcon className='icon'/>
                        <span>Dashboard</span>
                    </li>
                </Link>
                
                <Link to="/manageLocations" style={{textDecoration:"none"}}>
                    <li>
                        <LocationOnSharpIcon className='icon'/>
                        <span>Locations</span>
                    </li>
                </Link>

                <Link to="/manageGuides" style={{textDecoration:"none"}}>
                    <li>
                        <ElderlySharpIcon className='icon'/>
                        <span>Guides</span>
                    </li>
                </Link>

                <Link to="/manageShops" style={{textDecoration:"none"}}>
                    <li>
                        <ShoppingCartSharpIcon className='icon'/>
                        <span>Shops</span>
                    </li>
                </Link>

                <Link to="/manageReviews" style={{textDecoration:"none"}}>
                    <li>
                        <ReviewsSharpIcon className='icon'/>
                        <span>Reviews</span>
                    </li>
                </Link>

            </ul>
        </div>
    </div>
  );
};

export default AdminSidebar;