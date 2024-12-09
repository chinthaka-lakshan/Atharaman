import React, { useState } from 'react';
import './ViewGuide.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';

const ViewGuide = () => {
    const [guide, setGuide] = useState('');
    const [description, setDescription] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');
    const [nic, setNIC] = useState('');

    return (
        <div className='viewGuide'>
            <AdminSidebar/>
            <div className='viewGuideContainer'>
                <AdminNavbar/>
                <div className='top'>
                    <h1 className='title'>Information</h1>

                    <div className='item'>
                        <img src='/assets/Locations/ChinthakaLakshan_1.jpg' alt='' className='itemImg'/>
                        <div className='details'>
                            <div className='detailItem'>
                                <span className='itemKey'>Guide: </span>
                                <span className='itemValue'>Chinthaka Lakshan</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Guide ID: </span>
                                <span className='itemValue'>10</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Description: </span>
                                <span className='itemValue'>dfsvfsfsddvfdfvdsfddbfdvdfvfdvdvvdvdfvdsvd</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Phone Number: </span>
                                <span className='itemValue'>0765220227</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>E-Mail: </span>
                                <span className='itemValue'>chintha@gmail.com</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>NIC: </span>
                                <span className='itemValue'>200245665V</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bottom'>
                    <h1 className='title'>Edit Form</h1>

                    <div className='right'>
                        <form>
                            <div className='formInput'>
                                <label>Guide</label>
                                <input 
                                    type='String' 
                                    id='GUIDE' 
                                    name='guide' 
                                    placeholder='Enter Guide Name'
                                    value={guide}
                                    onChange={(e) => setGuide(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='formInput'>
                                <label>Description</label>
                                <input 
                                    type='String' 
                                    id='DESCRIPTION' 
                                    name='description' 
                                    placeholder='Enter Description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='formInput'>
                                <label>Phone Number</label>
                                <input 
                                    type='String' 
                                    id='PHONENO' 
                                    name='phoneNo' 
                                    placeholder='Enter Phone Number'
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='formInput'>
                                <label>E-Mail</label>
                                <input 
                                    type='String' 
                                    id='EMAIL' 
                                    name='email' 
                                    placeholder='Enter E-Mail'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='formInput'>
                                <label>NIC</label>
                                <input 
                                    type='String' 
                                    id='NIC' 
                                    name='nic' 
                                    placeholder='Enter NIC'
                                    value={nic}
                                    onChange={(e) => setNIC(e.target.value)}
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

export default ViewGuide;