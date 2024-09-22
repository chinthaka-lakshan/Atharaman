import React from 'react'
import './Title.css'
import { Link } from 'react-router-dom'

const Title = ({subTitle, title, link, btn}) => {
  return (
    <div className='title'>
      <p>{subTitle}</p>
      <h2>{title}</h2>
      <Link to={link}><button>{btn}</button></Link>
    </div>
  )
}

export default Title
