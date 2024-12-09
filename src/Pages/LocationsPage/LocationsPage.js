import React from 'react'
import './LocationsPage.css'
import Navbar from '../../Components/Navbar/Navbar'
import Places  from '../../Pages/Places/places'

const LocationsPage = () => {
  return (
    <div>
      <Navbar/>
      <div className='locationsPlatter container'>
        <div className='locationsPlatter-text'>
          <h1>Camping Locations In Sri Lanka</h1>
          <p>Welcome To Camping Locations Page! You Can See All Campsites In Here</p>
          <button className='btn'>Explore More</button>
        </div>
      </div>
      <Places/>
    </div>
  )
}

export default LocationsPage