import React, { useRef } from 'react';
import './GuidesPage.css';
import GuidesList from '../../Components/GuidesList/GuidesList';
import Footer from '../../Components/Footer/Footer';

const GuidesPage = () => {
  const guidesListRef = useRef(null);
  
  const scrollToGuidesList = () => {
    guidesListRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className='guidesPlatter container'>
        <div className='guidesPlatter-text'>
          <h1>Camping Guides In Sri Lanka</h1>
          <p>Welcome To Guides Page! You Can See All The Guides In Here</p>
          <button className='btn' onClick={scrollToGuidesList}>
            Explore
          </button>
        </div>
      </div>
      <div ref={guidesListRef}>
        <GuidesList/>
      </div>
      <Footer/>
    </div>
  )
}

export default GuidesPage;