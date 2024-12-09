import React from 'react'
import './Widget.css'
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';

const Widget = () => {
  return (
    <div className='widget'>
        <div className='left'>
            <span className='title'>LOCATIONS</span>
            <span className='counter'>25</span>
            <span className='link'>See Details</span>
        </div>
        <div className='right'>
            <div className='percentage'>
                <KeyboardArrowUpSharpIcon/>
                45%
                <LocationOnSharpIcon className='icon'/>
            </div>
        </div>
    </div>
  )
}

export default Widget