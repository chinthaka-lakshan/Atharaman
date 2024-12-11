import React from 'react'
import './ShopsPage.css'
import ItemList from '../../Components/ItemList/ItemList';
import Navbar from '../../Components/Navbar/Navbar';

const ShopsPage = () => {
  return (
    <div>
      <Navbar/>
      <div className='shopsPlatter container'>
        <div className='shopsPlatter-text'>
          <h1>Camping Gear Shops In Sri Lanka</h1>
          <p>Welcome To Shops! You Can See All The Camping Gear Shops In Here</p>
          <button className='btn'>Explore More</button>
        </div>
      </div>
      <ItemList/>
    </div>
  )
}

export default ShopsPage
