import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import './Navbar.css';
import Logo from '../../Assets/Logo.jpg';
import MenuIcon from '../../Assets/MenuIcon.png';

const Navbar = ({ user, logout }) => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      scroller.scrollTo('homePlatter container', {
        smooth: true,
        offset: 0,
        duration: 500,
      });
    } else {
      navigate('/');
    }
  };

  const handleAboutUsClick = () => {
    navigate('/');
    setTimeout(() => {
      scroller.scrollTo('aboutUs', {
        smooth: true,
        offset: -100,
        duration: 500,
      });
    }, 100);
  };

  const handleContactUsClick = () => {
    navigate('/');
    setTimeout(() => {
      scroller.scrollTo('footer', {
        smooth: true,
        duration: 500,
        offset: 0,
      });
    }, 100);
  };

  return (
    <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
      <Link to='/adminPanel'>
        <img src={Logo} alt='logo' className='logo' />
      </Link>
      <ul className={`menu ${mobileMenu ? 'show-mobile-menu' : 'hide-mobile-menu'}`}>
        <li onClick={handleHomeClick} className="link-button">Home</li>
        <li><Link to='/locations'>Locations</Link></li>
        <li><Link to='/guides'>Guide</Link></li>
        <li><Link to='/items'>Items</Link></li>
        <li onClick={handleAboutUsClick} className="link-button">About Us</li>
        <li onClick={handleContactUsClick} className="link-button">Contact Us</li>
        <li><Link to='/reviews'>Review</Link></li>

        {user ? (
          <>
            <li><Link to='/profile'>Profile</Link></li>
            <li onClick={logout} className="nav-button">Logout</li>
          </>
        ) : (
          <li><Link to='/login'>Login</Link></li>
        )}
      </ul>
      <img src={MenuIcon} alt="Menu Icon" className='menu-icon' onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;
