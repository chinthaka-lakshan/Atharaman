import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewGuide.css";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import ElderlySharpIcon from '@mui/icons-material/ElderlySharp';

const ViewGuide = () => {
    const { id } = useParams();
    const [guideName, setGuideName] = useState('');
    const [description, setDescription] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');
    const [nic, setNic] = useState('');
    const [guideLocations, setGuideLocations] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);

    const guideLocationsList = ["Central", "Western", "Uva", "North", "Southern", "Eastern"];

    useEffect(() => {
        fetchGuide();
    }, [id]);

    async function fetchGuide() {
        try {
            const response = await axios.get(`http://localhost:8080/guides/${id}`);
            const data = response.data;
            setGuideName(data.guideName);
            setDescription(data.description);
            setPhoneNo(data.phoneNo);
            setEmail(data.email);
            setNic(data.nic);
            setGuideLocations(data.guideLocations)
            setMainImagePreview(data.mainImage);
        } catch (error) {
            console.error("Error fetching guide details:", error.message);
            alert("Failed to fetch guide details.");
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
            const updatedImages = [...mainImage];
            const updatedPreviews = [...mainImagePreview];
            updatedImages[index] = file;
            updatedPreviews[index] = URL.createObjectURL(file);
            updatedImages[index] = file;
            updatedPreviews[index] = URL.createObjectURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("guideName", guideName);
        formData.append("description", description);
        formData.append("phoneNo", phoneNo);
        formData.append("email", email);
        formData.append("nic", nic);
        formData.append("guideLocations", guideLocations);
    
        if (mainImage) {
            formData.append("mainImage", mainImage);
        }

        try {
            const response = await axios.put(`http://localhost:8080/guides/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Guide updated successfully!");
            fetchGuide(); // Refresh data to reflect updated images
        } catch (error) {
            console.error("Error updating guide:", error.response || error);
            alert("An error occurred while updating the guide.");
        }
    };

    return (
        <div className="viewGuide">
            <AdminSidebar />
            <div className="viewGuideContainer">
                <AdminNavbar />
                <div className="top">
                    <h1>Guide Details</h1>
                    <div className="imageGallery">
                        {mainImagePreview && <img src={mainImagePreview} alt="Main" />}
                    </div>
                    <div className="details">
                        <p><strong>Guide ID:</strong> {id}</p>
                        <p><strong>Guide Name:</strong> {guideName}</p>
                        <p><strong>Description:</strong> {description}</p>
                        <p><strong>Phone No:</strong> {phoneNo}</p>
                        <p><strong>E-Mail:</strong> {email}</p>
                        <p><strong>NIC:</strong> {nic}</p>
                        <p><strong>Expert Locations:</strong> {guideLocations}</p>
                    </div>
                </div>
                <div className="bottom">
                    <h2>Edit Guide</h2>
                    <form className="eForm" onSubmit={handleSubmit}>
                        <div className="formImages">
                            <div className="mainImage">
                                <input
                                    id="mainImageInput"
                                    type="file"
                                    className="mainImg"
                                    onChange={(e) => handleImageChange(-1, e.target.files[0])}
                                />
                                <label htmlFor="mainImageInput">Image</label>
                                {mainImagePreview && <img src={mainImagePreview} alt="Main Preview" />}
                            </div>
                        </div>
                        <div className="formDetails">
                            <div className="editFormInput">
                                <label>Guide Name:</label>
                                <input type="text" value={guideName} onChange={(e) => setGuideName(e.target.value)} />
                            </div>
                            <div className="editFormInput">
                                <label>Description:</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="editFormInput">
                                <label>Phone No:</label>
                                <input value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                            </div>
                            <div className="editFormInput">
                                <label>E-Mail:</label>
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="editFormInput">
                                <label>NIC:</label>
                                <input value={nic} onChange={(e) => setNic(e.target.value)} />
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