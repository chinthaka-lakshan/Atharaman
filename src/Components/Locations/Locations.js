// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Locations.css';
// import Narangala from '../../Assets/Narangala_1.jpg';
// import Wangedigala from '../../Assets/Wangedigala_1.jpg';
// import HarithaKanda from '../../Assets/HarithaKanda_1.jpg';

// const Locations = () => {
//   return (
//     <div className='locations'>
//       <div className='location'>
//         <Link to="/location/Narangala">
//           <img src={Narangala} alt="Narangala" />
//           <div className='caption'>
//             <p>Narangala</p>
//           </div>
//         </Link>
//       </div>
//       <div className='location'>
//         <Link to="/location/Wangedigala">
//           <img src={Wangedigala} alt="Wangedigala" />
//           <div className='caption'>
//             <p>Wangedigala</p>
//           </div>
//         </Link>
//       </div>
//       <div className='location'>
//         <Link to="/location/HarithaKanda">
//           <img src={HarithaKanda} alt="Haritha Kanda" />
//           <div className='caption'>
//             <p>Haritha Kanda</p>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Locations;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Locations.css';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8080/locations');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div>Loading locations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="locations-container">
      <div className="locations-grid">
        {locations.map((location) => (
          <Link to={`/locationView/${location.id}`} key={location.id} className="location-card">
            <div className="location-image-container">
              <img
                className="location-image"
                src={`http://localhost:8080/locations-images/${location.id}/${location.mainImage}`}
                alt={location.location}
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/300';
                  e.target.alt = 'Image not available';
                }}
              />
              <div className="location-info">
                <h3 className="location-title">{location.location}</h3>
                <p className="location-description">{location.shortDescription}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Locations;


