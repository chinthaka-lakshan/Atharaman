import React from 'react'
import './Places.css'
import Narangala from '../../Assets/Narangala_1.jpg'
import Wangedigala from '../../Assets/Wangedigala_1.jpg'
import HarithaKanda from '../../Assets/HarithaKanda_1.jpg'

const Places = () => {
  return (
    <div className='places'>
      <div className='place'>
        <img src={Narangala} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>Narangala</p>
        </div>
      </div>
      <div className='place'>
        <img src={Wangedigala} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>Wangedigala</p>
        </div>
      </div>
      <div className='place'>
        <img src={HarithaKanda} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>Haritha Kanda</p>
        </div>
      </div>
    </div>
  )
}

export default Places
