import React, { useState} from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Logo from '../../Assets/Logo.jpg'

const Footer = () => {
  const [loading, setLoading] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="landing-page">
      <footer id="footer" className="footer">
        <div className="footer-col">
          <img src={Logo} alt='' className="footer-logo" />
          
          <p>atharaman@gmail.com</p>
          <p>0771234564</p>
          
          <div className="social-media-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-tiktok"></i>
            </a>
            <a href ="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
            </a>
          </div>
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} ATHARAMAN. All rights reserved.</p>
          </div>
        </div>
        <div className="footer-col">
          <h3>Total Places </h3>
          <p id='realTimevalues'>100+</p>
          
        </div>
        <div className="footer-col">
        <h3>Total Guides </h3>
        <p id='realTimevalues'>500+</p>
        </div>
        <div className="footer-col">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" id="inquiry-email" placeholder="Your email" required />
            <textarea placeholder="Your message" required></textarea>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
        <button className="scroll-to-top" onClick={scrollToTop}>
            <i className="fas fa-arrow-up"></i> {/* FontAwesome icon for the arrow */}
        </button>
      </footer>
    </div>
  );
};

export default Footer;