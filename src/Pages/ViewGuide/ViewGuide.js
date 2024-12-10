import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewGuide.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import ElderlySharpIcon from '@mui/icons-material/ElderlySharp';
import { DriveFolderUploadOutlined, Close } from "@mui/icons-material";

const ViewGuide = () => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [image5, setImage5] = useState(null);
    const { id } = useParams(); // Get the guide ID from the URL parameters
    const [guideName, setGuideName] = useState('');
    const [description, setDescription] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');
    const [nic, setNic] = useState('');

    const handleImageChange = (setImage, e) => {
        const file = e.target.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    
        if (file && !allowedTypes.includes(file.type)) {
          alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
          return;
        }
    
        setImage(file ? URL.createObjectURL(file) : null);
    };

    // Fetch guide data based on the guide ID
    const fetchGuide = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/guides/${id}`);
            const { guideName, description, phoneNo, email, nic } = response.data;
            setGuideName(guideName);
            setDescription(description);
            setPhoneNo(phoneNo);
            setEmail(email);
            setNic(nic);
        } catch (error) {
            console.error("Error fetching guide data", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedGuide = { guideName, description, phoneNo, email, nic };

        try {
            await axios.put(`http://localhost:8080/guides/${id}`, updatedGuide); // Update with your API URL
            alert("Guide updated successfully!");
        } catch (error) {
            console.error("Error updating guide", error);
        }
    };

    const locations = ["Central", "Western", "Uva", "North", "Southern", "Eastern"];

    useEffect(() => {
        fetchGuide();
    }, [id]);

    return (
        <div className='viewGuide'>
            <AdminSidebar/>
            <div className='viewGuideContainer'>
                <AdminNavbar/>
                <div className='top'>
                    <div className='titleImg'>
                        <h1 className='title'>Guide Details</h1>
                        <div className='itemImages'>
                            <img src='/assets/Locations/Narangala_1.jpg' alt='' className='itemImg'/>
                            <img src='/assets/Locations/Narangala_1.jpg' alt='' className='itemImg'/>
                            <img src='/assets/Locations/Narangala_1.jpg' alt='' className='itemImg'/>
                            <img src='/assets/Locations/Narangala_1.jpg' alt='' className='itemImg'/>
                            <img src='/assets/Locations/Narangala_1.jpg' alt='' className='itemImg'/>
                        </div>
                    </div>
                    <div className='details'>
                        <div className='detailItem'>
                            <span className='itemKey'>Guide ID: </span>
                            <span className='itemValue'>{id}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Guide: </span>
                            <span className='itemValue'>{guideName}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Phone No: </span>
                            <span className='itemValue'>{phoneNo}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>E-Mail: </span>
                            <span className='itemValue'>{email}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>NIC: </span>
                            <span className='itemValue'>{nic}</span>
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
                            {[image1, image2, image3, image4, image5].map((src, index) => (
                                <div key={index} className="imageContainer">
                                    {src ? (
                                        <div className="imageWrapper">
                                            <img
                                            src={src}
                                            alt={`Uploaded Preview ${index + 1}`}
                                            className="imagePreview"
                                            />
                                            <Close
                                            className="removeIcon"
                                            onClick={() => {
                                                switch (index) {
                                                    case 0:
                                                        setImage1(null);
                                                        break;
                                                    case 1:
                                                        setImage2(null);
                                                        break;
                                                    case 2:
                                                        setImage3(null);
                                                        break;
                                                    case 3:
                                                        setImage4(null);
                                                        break;
                                                    case 4:
                                                        setImage5(null);
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }}
                                            />
                                        </div>
                                        ) : (
                                        <ElderlySharpIcon className="placeholder"/>
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
                                <span>Main Image</span>
                                </label>
                                <input
                                type="file"
                                id="fileInput1"
                                onChange={(e) => handleImageChange(setImage1, e)}
                                style={{ display: "none" }}
                                />
                            </div>
                            <div className="formInput">
                                <label htmlFor="fileInput2" className="fileUploadLabel">
                                <DriveFolderUploadOutlined className="uploadIcon" />
                                <span>Image 2</span>
                                </label>
                                <input
                                type="file"
                                id="fileInput2"
                                onChange={(e) => handleImageChange(setImage2, e)}
                                style={{ display: "none" }}
                                />
                            </div>
                            <div className="formInput">
                                <label htmlFor="fileInput3" className="fileUploadLabel">
                                <DriveFolderUploadOutlined className="uploadIcon" />
                                <span>Image 3</span>
                                </label>
                                <input
                                type="file"
                                id="fileInput3"
                                onChange={(e) => handleImageChange(setImage3, e)}
                                style={{ display: "none" }}
                                />
                            </div>
                            <div className="formInput">
                                <label htmlFor="fileInput4" className="fileUploadLabel">
                                <DriveFolderUploadOutlined className="uploadIcon" />
                                <span>Image 4</span>
                                </label>
                                <input
                                type="file"
                                id="fileInput4"
                                onChange={(e) => handleImageChange(setImage4, e)}
                                style={{ display: "none" }}
                                />
                            </div>
                            <div className="formInput">
                                <label htmlFor="fileInput5" className="fileUploadLabel">
                                <DriveFolderUploadOutlined className="uploadIcon" />
                                <span>Image 5</span>
                                </label>
                                <input
                                type="file"
                                id="fileInput5"
                                onChange={(e) => handleImageChange(setImage5, e)}
                                style={{ display: "none" }}
                                />
                            </div>
                        </div>
                        <div className="inputFields">
                            <div className="formInput">
                                <label>Guide Name</label>
                                <input
                                type="text"
                                id="GUIDE_NAME"
                                name="guideName"
                                placeholder="Enter Guide Name"
                                required
                                />
                            </div>
                            <div className="formInput">
                                <label>Phone No</label>
                                <input
                                type="text"
                                id="GUIDE_PHONE"
                                name="guidePhone"
                                placeholder="Enter Phone No"
                                required
                                />
                            </div>
                            <div className="formInput">
                                <label>E-Mail</label>
                                <input
                                type="text"
                                id="GUIDE_EMAIL"
                                name="guideEmail"
                                placeholder="Enter E-Mail"
                                required
                                />
                            </div>
                            <div className="formInput">
                                <label>NIC</label>
                                <input
                                type="text"
                                id="GUIDE_NIC"
                                name="guideNic"
                                placeholder="Enter NIC"
                                required
                                />
                            </div>
                            <div className="formInput">
                                <label>Description</label>
                                <input
                                type="text"
                                id="GUIDE_DESCRIPTION"
                                name="guideDescription"
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

export default ViewGuide;