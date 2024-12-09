import React, { useState } from 'react';
import './AddNewGuide.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import { DriveFolderUploadOutlined } from '@mui/icons-material';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import axios from 'axios';

const AddNewGuide = () => {
  // Initial state for form data
  const initialFormState = {
    id: '',
    guideName: '',
    description: '',
    phoneNo: '',
    email: '',
    nic: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [file, setFile] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = {
      id: formData.id,
      guideName: formData.guideName,
      description: formData.description,
      phoneNo: formData.phoneNo,
      email: formData.email,
      nic: formData.nic,
    };

    try {
      const response = await axios.post('http://localhost:8080/guides', formDataToSend);
      alert('Guide added successfully');
      console.log(response.data);

      // Clear form fields after successful submission
      setFormData(initialFormState); // Reset form data
      setFile(null); // Clear the file input
    } catch (error) {
      console.error('There was an error adding the guide!', error);
    }
  };

  return (
    <div className='addNew'>
      <AdminSidebar />
      <div className='addNewContainer'>
        <AdminNavbar />
        <div className='top'>
          <h1>Add New Guide</h1>
        </div>
        <div className='bottom'>
          <div className='left'>
            <LocationOnSharpIcon className='image' />
          </div>
          <div className='right'>
            <form onSubmit={handleSubmit}>
              <div className='formInput'>
                <label htmlFor='file'>
                  Image: <DriveFolderUploadOutlined className='icon' />
                </label>
                <input
                  type='file'
                  id='file'
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className='formInput'>
                <label>Guide ID</label>
                <input
                  type='number'
                  id='id'
                  placeholder='Enter Guide ID'
                  value={formData.id}
                  onChange={handleInputChange}
                />
              </div>
              <div className='formInput'>
                <label>Guide</label>
                <input
                  type='text'
                  id='guideName'
                  placeholder='Enter Guide Name'
                  value={formData.guideName}
                  onChange={handleInputChange}
                />
              </div>
              <div className='formInput'>
                <label>Description</label>
                <input
                  type='text'
                  id='description'
                  placeholder='Enter Description'
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className='formInput'>
                <label>Phone Number</label>
                <input
                  type='text'
                  id='phoneNo'
                  placeholder='Enter Phone Number'
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className='formInput'>
                <label>E-Mail</label>
                <input
                  type='text'
                  id='email'
                  placeholder='Enter E-Mail'
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className='formInput'>
                <label>NIC</label>
                <input
                  type='text'
                  id='nic'
                  placeholder='Enter NIC'
                  value={formData.nic}
                  onChange={handleInputChange}
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

export default AddNewGuide;
