import React, { useRef } from 'react';
import './LocationsPage.css';
import LocationsList from '../../Components/LocationsList/LocationsList';
import Footer from '../../Components/Footer/Footer';

const LocationsPage = () => {
  const locationsListRef = useRef(null);

  const scrollToLocationsList = () => {
    locationsListRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className='locationsPlatter container'>
        <div className='locationsPlatter-text'>
          <h1>Camping Locations In Sri Lanka</h1>
          <p>Welcome To Camping Locations Page! You Can See All Campsites In Here</p>
          <button className='btn' onClick={scrollToLocationsList}>
            Explore
          </button>
        </div>
      </div>
      <div ref={locationsListRef}>
        <LocationsList />
      </div>
      <Footer />
    </div>
  );
};

export default LocationsPage;