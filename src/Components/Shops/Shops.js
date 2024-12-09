import React from 'react'
import './Shops.css'
import SLC from '../../Assets/SLC_1.jpg'
import Lacoste from '../../Assets/Lacoste_1.jpg'
import Lamborghini from '../../Assets/Lamborghini_1.jpg'

const Shops = () => {
  return (
    <div className='shops'>
      <div className='shop'>
        <img src={SLC} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>SLC</p>
        </div>
      </div>
      <div className='shop'>
        <img src={Lacoste} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>Lacoste</p>
        </div>
      </div>
      <div className='shop'>
        <img src={Lamborghini} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>Lamborghini</p>
        </div>
      </div>
    </div>

    
  )
}

export default Shops
