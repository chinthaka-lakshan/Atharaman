import React from 'react';
import './AddNewShop.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import { DriveFolderUploadOutlined } from '@mui/icons-material';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';

const AddNewShop = () => {
  return (
    <div className='addNew'>
      <AdminSidebar/>
      <div className='addNewContainer'>
        <AdminNavbar/>
        <div className='top'>
          <h1>Add New Shop</h1>
        </div>
        <div className='bottom'>
          <div className='left'>
            <LocationOnSharpIcon className='image'/>
          </div>
          <div className='right'>
            <form>
              <div className='formInput'>
                <label htmlFor='file'>Image: <DriveFolderUploadOutlined className='icon'/></label>
                <input type='file' id='file' style={{display: "none"}}/>
              </div>
              <div className='formInput'>
                <label>Shop ID</label>
                <input type='number' id='id' placeholder='Enter Shop ID'/>
              </div>
              <div className='formInput'>
                <label>Shop</label>
                <input type='text' id='shop' placeholder='Enter Shop Name'/>
              </div>
              <div className='formInput'>
                <label>Description</label>
                <input type='text' id='description' placeholder='Enter Description'/>
              </div>
              <div className='formInput'>
                <label>Location</label>
                <input type='text' id='shopLocation' placeholder='Enter Shop Location'/>
              </div>
              <div className='formInput'>
                <label>Phone Number</label>
                <input type='text' id='phoneNo' placeholder='Enter Phone Number'/>
              </div>
              <div className='formInput'>
                <label>E-Mail</label>
                <input type='text' id='email' placeholder='Enter E-Mail'/>
              </div>
              <button type='submit'>Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewShop;