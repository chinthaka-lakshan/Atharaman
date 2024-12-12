import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../Assets/Logo.jpg';
import MenuIcon from '../../Assets/MenuIcon.png';

const Navbar = ({ user, logout }) => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };
  
  return (
    <nav className={`container ${sticky? 'dark-nav' : ''}`}>
      <Link to='/adminPanel'><img src={Logo} alt='' className='logo'/></Link>
      <ul className={mobileMenu?'':'hide-mobile-menu'}>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/locations'>Locations</Link></li>
        <li><Link to='/guides'>Guide</Link></li>
        <li><Link to='/shops'>Shops</Link></li>
        <li><Link to='aboutUs' smooth={true} offset={-150} duration={500}>About Us</Link></li>
        <li><Link to='/contactUs' smooth={true} offset={0} duration={500}>Contact Us</Link></li>
        <li><Link to='/SiteReviewPage'>Review</Link></li>

        {user ? (
          <>
            <li><Link to='/profile'>Profile</Link></li>
            <li>
              <button 
                onClick={logout}
                className="nav-button"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li><Link to='/login'>Login</Link></li>
        )}

      </ul>
      <img src={MenuIcon} alt="" className='menu-icon' onClick={toggleMenu}/>
    </nav>
  );
};

export default Navbar;