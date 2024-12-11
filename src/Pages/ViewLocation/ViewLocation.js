import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewLocation.css";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";

const ViewLocation = () => {
    const { id } = useParams();
    const [location, setLocation] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [province, setProvince] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [extraImages, setExtraImages] = useState([null, null, null, null]);  // Ensure only one declaration
    const [extraImagePreviews, setExtraImagePreviews] = useState([null, null, null, null]);  // Ensure only one declaration

    const provinces = ["Central", "Western", "Uva", "North", "Southern", "Eastern"];

    useEffect(() => {
        fetchLocation();
    }, [id]);

    async function fetchLocation() {
        try {
            const response = await axios.get(`http://localhost:8080/locations/${id}`);
            const data = response.data;
            setLocation(data.location);
            setShortDescription(data.shortDescription);
            setLongDescription(data.longDescription);
            setProvince(data.province);
            setMainImagePreview(data.mainImage);
            setExtraImagePreviews([data.extraImage1, data.extraImage2, data.extraImage3, data.extraImage4]);
        } catch (error) {
            console.error("Error fetching location details:", error.message);
            alert("Failed to fetch location details.");
        }
    }

    const handleImageChange = (index, file) => {
        if (file && !["image/jpeg", "image/png"].includes(file.type)) {
            alert("Invalid file type. Please upload JPEG or PNG images.");
            return;
        }
    
        if (index === -1) { // Main image case
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        } else { // Extra images case
            const updatedImages = [...extraImages];
            const updatedPreviews = [...extraImagePreviews];
            updatedImages[index] = file;
            updatedPreviews[index] = URL.createObjectURL(file);
            setExtraImages(updatedImages);
            setExtraImagePreviews(updatedPreviews);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("location", location);
        formData.append("shortDescription", shortDescription);
        formData.append("longDescription", longDescription);
        formData.append("province", province);
    
        if (mainImage) {
            formData.append("mainImage", mainImage);
        }
    
        extraImages.forEach((img, index) => {
            if (img) {
                formData.append("extraImage", img); // Make sure to send all extra images
            }
        });
    
        try {
            const response = await axios.put(`http://localhost:8080/locations/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Location updated successfully!");
            fetchLocation(); // Refresh data to reflect updated images
        } catch (error) {
            console.error("Error updating location:", error.response || error);
            alert("An error occurred while updating the location.");
        }
    };
    

    return (
        <div className="viewLocation">
            <AdminSidebar />
            <div className="viewLocationContainer">
                <AdminNavbar />
                <div className="top">
                    <h1>Location Details</h1>
                    <div className="imageGallery">
                        {mainImagePreview && <img src={mainImagePreview} alt="Main" />}
                        {extraImagePreviews.map((img, index) =>
                            img ? <img key={index} src={img} alt={`Extra ${index + 1}`} /> : null
                        )}
                    </div>
                    <div className="details">
                        <p><strong>Location ID:</strong> {id}</p>
                        <p><strong>Location:</strong> {location}</p>
                        <p><strong>Province:</strong> {province}</p>
                        <p><strong>Short Description:</strong> {shortDescription}</p>
                        <p><strong>Long Description:</strong> {longDescription}</p>
                    </div>
                </div>
                <div className="bottom">
                    <h2>Edit Location</h2>
                    <form className="eForm" onSubmit={handleSubmit}>
                        <div className="formImages">
                            <div className="mainImage">
                                <input
                                    id="mainImageInput"
                                    type="file"
                                    className="mainImg"
                                    onChange={(e) => handleImageChange(-1, e.target.files[0])}
                                />
                                <label htmlFor="mainImageInput">Main Image</label>
                                {mainImagePreview && <img src={mainImagePreview} alt="Main Preview" />}
                            </div>
                            {extraImages.map((_, index) => (
                                <div key={index} className="extraImages">
                                    <div className="extraImage">
                                        <input
                                            id={`extraImageInput${index}`}
                                            type="file"
                                            className="extraImg"
                                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                                        />
                                        <label htmlFor={`extraImageInput${index}`}>Image {index + 2}</label>
                                        {extraImagePreviews[index] && (
                                            <img src={extraImagePreviews[index]} alt={`Extra Preview ${index + 1}`} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="formDetails">
                            <div className="editFormInput">
                                <label>Location Name:</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                            <div className="editFormInput">
                                <label>Province:</label>
                                <select value={province} onChange={(e) => setProvince(e.target.value)}>
                                    {provinces.map((prov, index) => (
                                        <option key={index} value={prov}>{prov}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="editFormInput">
                                <label>Short Description:</label>
                                <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
                            </div>
                            <div className="editFormInput">
                                <label>Long Description:</label>
                                <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
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
