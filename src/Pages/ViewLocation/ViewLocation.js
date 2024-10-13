import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewLocation.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';

const ViewLocation = () => {
    const { id } = useParams(); // Get the location ID from the URL parameters
    const [location, setLocation] = useState('');
    const [shortDescription, setShortDes] = useState('');
    const [longDescription, setLongDes] = useState('');
    const [province, setProvince] = useState('');

    // Fetch location data based on the location ID
    const fetchLocation = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/atharaman/${id}`);
            const { location, shortDescription, longDescription, province } = response.data;
            setLocation(location);
            setShortDes(shortDescription);
            setLongDes(longDescription);
            setProvince(province);
        } catch (error) {
            console.error("Error fetching location data", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedLocation = { location, shortDescription, longDescription, province };

        try {
            await axios.put(`http://localhost:8080/atharaman/${id}`, updatedLocation); // Update with your API URL
            alert("Location updated successfully!");
        } catch (error) {
            console.error("Error updating location", error);
        }
    };


    useEffect(() => {
        fetchLocation();
    }, [id]);

    return (
        <div className='viewLocation'>
            <AdminSidebar/>
            <div className='viewLocationContainer'>
                <AdminNavbar/>
                <div className='top'>
                    <h1 className='title'>Information</h1>

                    <div className='item'>
                        <img src='/assets/Locations/Narangala_1.jpg' alt='' className='itemImg'/>
                        <div className='details'>
                            <div className='detailItem'>
                                <span className='itemKey'>Location: </span>
                                <span className='itemValue'>{location}</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Location ID: </span>
                                <span className='itemValue'>{id}</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Short Description: </span>
                                <span className='itemValue'>{shortDescription}</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Long Description: </span>
                                <span className='itemValue'>{longDescription}</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Province: </span>
                                <span className='itemValue'>{province}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bottom'>
                    <h1 className='title'>Edit Form</h1>

                    <div className='right'>
                        <form onSubmit={handleSubmit}>
                            <div className='formInput'>
                                <label>Location</label>
                                <input 
                                    type='text' 
                                    id='LOCATION' 
                                    name='location' 
                                    placeholder='Enter Location Name'
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='formInput'>
                                <label>Short Description</label>
                                <input 
                                    type='text' 
                                    id='SHORTDES' 
                                    name='shortDescription' 
                                    placeholder='Enter Short Description'
                                    value={shortDescription}
                                    onChange={(e) => setShortDes(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='formInput'>
                                <label>Long Description</label>
                                <input 
                                    type='text' 
                                    id='LONGDES' 
                                    name='longDescription' 
                                    placeholder='Enter Long Description'
                                    value={longDescription}
                                    onChange={(e) => setLongDes(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='formInput'>
                                <label>Province</label>
                                <input 
                                    type='text' 
                                    id='PROVINCE' 
                                    name='province' 
                                    placeholder='Enter Located Province'
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                    required
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

export default ViewLocation;
