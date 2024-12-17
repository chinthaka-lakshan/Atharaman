import React from 'react'
import './ItemsPage.css'
import ItemsList from '../../Components/ItemsList/ItemsList';
import Footer from '../../Components/Footer/Footer';

const ItemsPage = () => {
  return (
    <div>
      <div className='itemsPlatter container'>
        <div className='itemsPlatter-text'>
          <h1>Camping Equipment In Sri Lanka</h1>
          <p>Welcome To Camping Equipment! You Can See All The Camping Gear In Here</p>
          <button className='btn'>Explore More</button>
        </div>
      </div>
      <ItemsList/>
      <Footer/>
    </div>
  )
}

export default ItemsPage;