import React from 'react'
import './GuidesPage.css'
import Navbar from '../../Components/Navbar/Navbar'
import GuidesList from '../../Components/GuidesList/GuidesList'

const GuidesPage = () => {
  return (
    <div>
      <Navbar/>
      <div className='guidesPlatter container'>
        <div className='guidesPlatter-text'>
          <h1>Camping Guides In Sri Lanka</h1>
          <p>Welcome To Guides Page! You Can See All The Guides In Here</p>
          <button className='btn'>Explore More</button>
        </div>
      </div>
      <GuidesList/>
    </div>
  )
}

export default GuidesPage
