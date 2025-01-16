import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewShop.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';

const ViewShop = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [contact, setPhoneNo] = useState('');
    const [province, setProvince] = useState('');

    const fetchShop = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/Shops/find-by-id/${id}`);
            const { name, description, contact,  province } = response.data;
            setName(name);
            setDescription(description);
            setPhoneNo(contact);
            setProvince(province);
        } catch (error) {
            console.error("Error fetching shop data", error);
        }
    };

    useEffect(() => {
        fetchShop();
    }, [id]);

    return (
        <div className='viewShop'>
            <AdminSidebar/>
            <div className='viewShopContainer'>
                <AdminNavbar/>
                <div className="top">
                    <h1>Shop Details</h1>
                    <div className="imageGallery">
                        <ShoppingCartSharpIcon className="img"/>
                    </div>
                    <div className="details">
                        <p><strong>Shop ID:</strong> {id}</p>
                        <p><strong>Shop Name:</strong> {name}</p>
                        <p><strong>Description:</strong> {description}</p>
                        <p><strong>Phone No:</strong> {contact}</p>
                        <p><strong>Province:</strong> {province}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewShop;