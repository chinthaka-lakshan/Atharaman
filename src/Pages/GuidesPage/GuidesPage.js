import React from 'react'
import './GuidesPage.css'
import GuidesList from '../../Components/GuidesList/GuidesList'
import Footer from '../../Components/Footer/Footer'

const GuidesPage = () => {
  return (
    <div>
      <div className='guidesPlatter container'>
        <div className='guidesPlatter-text'>
          <h1>Camping Guides In Sri Lanka</h1>
          <p>Welcome To Guides Page! You Can See All The Guides In Here</p>
          <button className='btn'>Explore More</button>
        </div>
      </div>
      <GuidesList/>
      <Footer/>
    </div>
  )
}

export default GuidesPage