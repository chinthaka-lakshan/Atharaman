import React from 'react';
import { Link } from 'react-router-dom';
import './Locations.css';
import Narangala from '../../Assets/Narangala_1.jpg';
import Wangedigala from '../../Assets/Wangedigala_1.jpg';
import HarithaKanda from '../../Assets/HarithaKanda_1.jpg';

const Locations = () => {
  return (
    <div className='locations'>
      <div className='location'>
        <Link to="/location/Narangala">
          <img src={Narangala} alt="Narangala" />
          <div className='caption'>
            <p>Narangala</p>
          </div>
        </Link>
      </div>
      <div className='location'>
        <Link to="/location/Wangedigala">
          <img src={Wangedigala} alt="Wangedigala" />
          <div className='caption'>
            <p>Wangedigala</p>
          </div>
        </Link>
      </div>
      <div className='location'>
        <Link to="/location/HarithaKanda">
          <img src={HarithaKanda} alt="Haritha Kanda" />
          <div className='caption'>
            <p>Haritha Kanda</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Locations;