import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewShop.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import { DriveFolderUploadOutlined, Close } from "@mui/icons-material";

const ViewShop = () => {
    const [image, setImage] = useState(null);
    const { id } = useParams(); // Get the shop ID from the URL parameters
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setPhoneNo] = useState('');
    // const [email, setEmail] = useState('');
    const [province, setProvince] = useState('');

    const handleImageChange = (setImage, e) => {
        const file = e.target.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    
        if (file && !allowedTypes.includes(file.type)) {
          alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
          return;
        }
    
        setImage(file ? URL.createObjectURL(file) : null);
    };

    // Fetch shop data based on the guide ID
    const fetchShop = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/Shops/find-by-id/${id}`);
            const { name, location, description, contact,  province } = response.data;
            setName(name);
            setDescription(description);
            setLocation(location);
            setPhoneNo(contact);
            // setEmail(email);
            setProvince(province);
        } catch (error) {
            console.error("Error fetching shop data", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedShop = { name, description, location, contact, province };

        try {
            await axios.put(`http://localhost:8080/Shops/update/${id}`, updatedShop); // Update with your API URL
            alert("Shop updated successfully!");
        } catch (error) {
            console.error("Error updating shop", error);
        }
    };

    const provinces = ["Central", "Western", "Uva", "North", "Southern", "Eastern"];

    useEffect(() => {
        fetchShop();
    }, [id]);

    return (
        <div className='viewShop'>
            <AdminSidebar/>
            <div className='viewShopContainer'>
                <AdminNavbar/>
                <div className='top'>
                    <div className='titleImg'>
                        <h1 className='title'>Shop Details</h1>
                        <div className='itemImages'>
                            <img src='/assets/Locations/Narangala_1.jpg' alt='' className='itemImg'/>
                        </div>
                    </div>
                    <div className='details'>
                        <div className='detailItem'>
                            <span className='itemKey'>Shop ID: </span>
                            <span className='itemValue'>{id}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Shop: </span>
                            <span className='itemValue'>{name}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Phone No: </span>
                            <span className='itemValue'>{contact}</span>
                        </div>
                        {/* <div className='detailItem'>
                            <span className='itemKey'>E-Mail: </span>
                            <span className='itemValue'>{email}</span>
                        </div> */}
                        <div className='detailItem'>
                            <span className='itemKey'>Province: </span>
                            <span className='itemValue'>{province}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Description: </span>
                            <span className='itemValue'>{description}</span>
                        </div>
                    </div>
                </div>

                <div className="bottom">
                    <h1 className='title'>Edit Details</h1>
                    <div className="images">
                        <div className="imageGrid">
                            {[image].map((src, index) => (
                                <div key={index} className="imageContainer">
                                    {src ? (
                                        <div className="imageWrapper">
                                            <img
                                            src={src}
                                            alt={`Uploaded Preview ${index}`}
                                            className="imagePreview"
                                            />
                                            <Close
                                            className="removeIcon"
                                            onClick={() => {
                                                switch (index) {
                                                    case 0:
                                                        setImage(null);
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }}
                                            />
                                        </div>
                                        ) : (
                                        <ShoppingCartSharpIcon className="placeholder"/>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="uploadButtons">
                            <div className="formInput">
                                <label htmlFor="fileInput1" className="fileUploadLabel">
                                <DriveFolderUploadOutlined className="uploadIcon" />
                                <span>Image</span>
                                </label>
                                <input
                                type="file"
                                id="fileInput1"
                                onChange={(e) => handleImageChange(setImage, e)}
                                style={{ display: "none" }}
                                />
                            </div>
                        </div>
                        <div className="inputFields">
                            <div className="formInput">
                                <label>Shop Name</label>
                                <input
                                type="text"
                                id="SHOP_NAME"
                                name="name"
                                placeholder="Enter Shop Name"
                                required
                                />
                            </div>
                            <div className="formInput">
                                <label>Phone No</label>
                                <input
                                type="text"
                                id="SHOP_PHONE"
                                name="shopPhone"
                                placeholder="Enter Shop No"
                                required
                                />
                            </div>
                            {/* <div className="formInput">
                                <label>E-Mail</label>
                                <input
                                type="text"
                                id="SHOP_EMAIL"
                                name="shopEmail"
                                placeholder="Enter E-Mail"
                                required
                                />
                            </div> */}
                            <div className="formInput">
                                <label>Province</label>
                                <select id="SHOP_PROVINCE" name="province" required>
                                {provinces.map((province, index) => (
                                    <option key={index} value={province}>
                                    {province}
                                    </option>
                                ))}
                                </select>
                            </div>
                            <div className="formInput">
                                <label>Description</label>
                                <input
                                type="text"
                                id="SHOP_DESCRIPTION"
                                name="shopDescription"
                                placeholder="Enter Description"
                                required
                                />
                            </div>
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ViewShop;