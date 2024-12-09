import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewLocation.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import { DriveFolderUploadOutlined, Close } from "@mui/icons-material";

const ViewLocation = () => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [image5, setImage5] = useState(null);
    const { id } = useParams(); // Get the location ID from the URL parameters
    const [location, setLocation] = useState('');
    const [shortDescription, setShortDes] = useState('');
    const [longDescription, setLongDes] = useState('');
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

    const provinces = ["Central", "Western", "Uva", "North", "Southern", "Eastern"];

    useEffect(() => {
        fetchLocation();
    }, [id]);

    return (
        <div className='viewLocation'>
            <AdminSidebar/>
            <div className='viewLocationContainer'>
                <AdminNavbar/>
                <div className='top'>
                    <div className='titleImg'>
                        <h1 className='title'>Location Details</h1>
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
                            <span className='itemKey'>Location ID: </span>
                            <span className='itemValue'>{id}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Location: </span>
                            <span className='itemValue'>{location}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Province: </span>
                            <span className='itemValue'>{province}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Short Description: </span>
                            <span className='itemValue'>{shortDescription}</span>
                        </div>
                        <div className='detailItem'>
                            <span className='itemKey'>Long Description: </span>
                            <span className='itemValue'>{longDescription}</span>
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
                                        <LocationOnSharpIcon className="placeholder"/>
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
                                <label>Location Name</label>
                                <input
                                type="text"
                                id="LOCATION_NAME"
                                name="locationName"
                                placeholder="Enter Location Name"
                                required
                                />
                            </div>
                            <div className="formInput">
                                <label>Province</label>
                                <select id="LOCATION_PROVINCE" name="province" required>
                                {provinces.map((province, index) => (
                                    <option key={index} value={province}>
                                    {province}
                                    </option>
                                ))}
                                </select>
                            </div>
                            <div className="formInput">
                                <label>Short Description</label>
                                <input
                                type="text"
                                id="LOCATION_SHORT_DESCRIPTION"
                                name="locationShortDescription"
                                placeholder="Enter Short Description"
                                required
                                />
                            </div>
                            <div className="formInput">
                                <label>Long Description</label>
                                <input
                                type="text"
                                id="LOCATION_LONG_DESCRIPTION"
                                name="locationLongDescription"
                                placeholder="Enter Long Description"
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

export default ViewLocation;