import React, { useEffect, useState } from 'react'
import './Navbar.css'
import Logo from '../../Assets/Logo.jpg'
import { Link } from 'react-scroll';
import MenuIcon from '../../Assets/MenuIcon.png'

const Navbar = () => {
    const [sticky, setSticky] = useState(false);
    useEffect(()=>{
        window.addEventListener('scroll', ()=>{
            window.scrollY > 50 ? setSticky(true) : setSticky(false);
        })
    },[]);

    const [mobileMenu, setMobileMenu] = useState(false);
    const toggleMenu = ()=>{
      mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
    }
    return (
        <nav className={`container ${sticky? 'dark-nav' : ''}`}>
          <img src={Logo} alt='' className='logo'/>
          <ul className={mobileMenu?'':'hide-mobile-menu'}>
            <li><Link to='hero' smooth={true} offset={0} duration={500}>Home</Link></li>
            <li><Link to='places' smooth={true} offset={-260} duration={500}>Places</Link></li>
            <li><Link to='guides' smooth={true} offset={-260} duration={500}>Guides</Link></li>
            <li><Link to='shops' smooth={true} offset={-260} duration={500}>Shops</Link></li>
            <li><Link to='aboutUs' smooth={true} offset={-150} duration={500}>About Us</Link></li>
            <li><Link to='contactUs' smooth={true} offset={0} duration={500}>Contact Us</Link></li>
          </ul>
          <img src={MenuIcon} alt="" className='menu-icon' onClick={toggleMenu}/>
        </nav>
      )
    }
    
    export default Navbar