import React from 'react'
import './Guides.css'
import SachinthaRashen from '../../Assets/SachinthaRashen_1.jpg'
import ChinthakaLakshan from '../../Assets/ChinthakaLakshan_1.jpg'
import SachinthaJayaweera from '../../Assets/SachinthaJayaweera_1.jpg'

const Guides = () => {
  return (
    <div className='guides'>
      <div className='guide'>
        <img src={SachinthaRashen} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>Sachintha Rashen</p>
        </div>
      </div>
      <div className='guide'>
        <img src={ChinthakaLakshan} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>Chinthaka Lakshan</p>
        </div>
      </div>
      <div className='guide'>
        <img src={SachinthaJayaweera} alt=""/>
        <div className='caption'>
            <img src="" alt="" />
            <p>Sachintha Jayaweera</p>
        </div>
      </div>
    </div>
  )
}

export default Guides
