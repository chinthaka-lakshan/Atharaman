import axios from 'axios';
import React, { useState } from 'react';
import './AddNewLocation.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';

const AddNewLocation = () => {
  // Initial empty state for the form
  const initialState = {
    locationId: '',
    location: '',
    shortDes: '',
    longDes: '',
    province: '',
  };

  // Form state
  const [formData, setFormData] = useState(initialState);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh

    try {
      // Send form data to the server
      await axios.post('http://localhost:8080/atharaman', {
        locationId: formData.locationId,
        location: formData.location,
        shortDescription: formData.shortDes,
        longDescription: formData.longDes,
        province: formData.province,
      });

      // Display success message (optional)
      alert('Location added successfully!');

      // Clear the form by resetting the state to the initial values
      setFormData(initialState);
    } catch (error) {
      console.error('There was an error saving the location!', error);
      alert('Failed to add location.');
    }
  };

  return (
    <div className='addNew'>
      <AdminSidebar />
      <div className='addNewContainer'>
        <AdminNavbar />
        <div className='top'>
          <h1>Add New Location</h1>
        </div>
        <div className='bottom'>
          <div className='right'>
            <form onSubmit={handleSubmit}>
              <div className='formInput'>
                <label>Location ID</label>
                <input
                  type='number'
                  id='locationId'
                  value={formData.locationId}
                  onChange={handleChange}
                  placeholder='Enter Location ID'
                />
              </div>
              <div className='formInput'>
                <label>Location</label>
                <input
                  type='text'
                  id='location'
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='Enter Location Name'
                />
              </div>
              <div className='formInput'>
                <label>Short Description</label>
                <input
                  type='text'
                  id='shortDes'
                  value={formData.shortDes}
                  onChange={handleChange}
                  placeholder='Enter Short Description'
                />
              </div>
              <div className='formInput'>
                <label>Long Description</label>
                <input
                  type='text'
                  id='longDes'
                  value={formData.longDes}
                  onChange={handleChange}
                  placeholder='Enter Long Description'
                />
              </div>
              <div className='formInput'>
                <label>Province</label>
                <input
                  type='text'
                  id='province'
                  value={formData.province}
                  onChange={handleChange}
                  placeholder='Enter Province'
                />
              </div>
              <button type='submit'>Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewLocation;
