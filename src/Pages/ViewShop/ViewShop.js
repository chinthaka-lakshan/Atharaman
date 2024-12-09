import React, { useState, useParams } from 'react';
import './ViewShop.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';

const ViewShop = () => {
    const [shop, setShop] = useState('');
    const [description, setDescription] = useState('');
    const [shopLocation, setShopLocation] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');

    return (
        <div className='viewShop'>
            <AdminSidebar/>
            <div className='viewShopContainer'>
                <AdminNavbar/>
                <div className='top'>
                    <h1 className='title'>Information</h1>

                    <div className='item'>
                        <img src='/assets/Locations/Lacoste_1.jpg' alt='' className='itemImg'/>
                        <div className='details'>
                            <div className='detailItem'>
                                <span className='itemKey'>Shop: </span>
                                <span className='itemValue'>Lacoste</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Shop ID: </span>
                                <span className='itemValue'>100</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Description: </span>
                                <span className='itemValue'>dfsvfsfsddvfdfvdsfddbfdvdfvfdvdvvdvdfvdsvd</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Location: </span>
                                <span className='itemValue'>fvfdvsfdvfdvfd</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>Phone Number: </span>
                                <span className='itemValue'>0758475225</span>
                            </div>
                            <div className='detailItem'>
                                <span className='itemKey'>E-Mail: </span>
                                <span className='itemValue'>chintha@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bottom'>
                    <h1 className='title'>Edit Form</h1>

                    <div className='right'>
                        <form>
                            <div className='formInput'>
                                <label>Shop</label>
                                <input 
                                    type='String' 
                                    id='SHOP' 
                                    name='shop' 
                                    placeholder='Enter Shop Name'
                                    value={shop}
                                    onChange={(e) => setShop(e.target.value)}
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
                                <label>Location</label>
                                <input 
                                    type='String' 
                                    id='LOCATION' 
                                    name='shopLocation' 
                                    placeholder='Enter Shop Location'
                                    value={shopLocation}
                                    onChange={(e) => setShopLocation(e.target.value)}
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
                                    placeholder='Enter E_Mail'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

export default ViewShop;