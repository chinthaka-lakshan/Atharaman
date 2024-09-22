import React from 'react'
import './AboutUs.css'
import AboutUs_IMG from '../../Assets/AboutUs.jpeg'

const AboutUs = () => {
  return (
    <div className='aboutUs'>
      <div className='aboutUs-left'>
        <img src={AboutUs_IMG} alt="" className='aboutUs-img'/>
      </div>
      <div className='aboutUs-right'>
        <h3>ABOUT US</h3>
        <h2>A Guide To The Great Outdoors</h2>
        <p>The ‘ATHARAMAN’ website project focuses on developing a comprehensive camping details website designed for camping enthusiasts. This research-based platform will serve as an essential resource, providing detailed insights into camping locations, gear recommendations, guides, safety tips, weather updates, and more.</p>
        <p>Given the rising popularity of outdoor activities, especially camping, there is a growing demand for reliable, centralized information that can enhance the overall camping experience. Our project intends to fill this gap by offering a well-organized, user-friendly platform that caters to both new and experienced campers.</p>
        <p>Our goal is to create a user-friendly, informative, and visually appealing website that will become the go-to destination for campers. The platform will provide comprehensive camping information and offer a one-stop resource for camping enthusiasts.</p>
        <p>The website will include a comprehensive database of campsites, equipment shops, guides, and expert advice on everything from tips to survival skills. This will offer a one-stop resource for camping enthusiasts, featuring an intuitive and user-friendly UI that makes it easy for users to navigate and plan their ideal camping trips.</p>
      </div>
    </div>
  )
}

export default AboutUs
