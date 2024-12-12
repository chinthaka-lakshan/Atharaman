import React from 'react'
import './ItemsPage.css'
import ItemList from '../../Components/ItemList/ItemList';

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
      <ItemList/>
    </div>
  )
}

export default ItemsPage;