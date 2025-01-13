import React, { useRef } from 'react';
import './ItemsPage.css';
import ItemsList from '../../Components/ItemsList/ItemsList';
import Footer from '../../Components/Footer/Footer';

const ItemsPage = () => {
  const itemsListRef = useRef(null);
  
  const scrollToItemsList = () => {
    itemsListRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className='itemsPlatter container'>
        <div className='itemsPlatter-text'>
          <h1>Camping Equipment In Sri Lanka</h1>
          <p>Welcome To Camping Equipment! You Can See All The Camping Gear In Here</p>
          <button className='btn' onClick={scrollToItemsList}>
            Explore
          </button>
        </div>
      </div>
      <div ref={itemsListRef}>
        <ItemsList/>
      </div>
      <Footer/>
    </div>
  )
}

export default ItemsPage;