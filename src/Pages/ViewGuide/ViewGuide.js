import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewGuide.css";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";

const ViewGuide = () => {
    const { id } = useParams();
    const [name, setGuideName] = useState("");
    const [description, setDescription] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [email, setEmail] = useState("");
    const [nic, setNic] = useState("");
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [extraImagePreviews, setExtraImagePreviews] = useState([null, null, null, null]);

    useEffect(() => {
        fetchGuide();
    }, [id]);

    async function fetchGuide() {
        try {
            const response = await axios.get(`http://localhost:8080/api/guides/id/${id}`);
            const data = response.data;
            setGuideName(data.name);
            setDescription(data.description);
            setContactNo(data.contactNo);
            setEmail(data.email);
            setNic(data.nic);
            setMainImagePreview(data.mainImage);
            setExtraImagePreviews([data.extraImage1, data.extraImage2, data.extraImage3, data.extraImage4]);
        } catch (error) {
            console.error("Error fetching guide details:", error.message);
            alert("Failed to fetch guide details.");
        }
    }

    return (
        <div className="viewGuide">
            <AdminSidebar />
            <div className="viewGuideContainer">
                <AdminNavbar />
                <div className="top">
                    <h1>Guide Details</h1>
                    <div className="imageGallery">
                        {mainImagePreview && <img src={mainImagePreview} alt="Main" />}
                        {extraImagePreviews.map((img, index) =>
                            img ? <img key={index} src={img} alt={`Extra ${index + 1}`} /> : null
                        )}
                    </div>
                    <div className="details">
                        <p><strong>Guide ID:</strong> {id}</p>
                        <p><strong>Guide Name:</strong> {name}</p>
                        <p><strong>Description:</strong> {description}</p>
                        <p><strong>Phone No:</strong> {contactNo}</p>
                        <p><strong>E-Mail:</strong> {email}</p>
                        <p><strong>NIC:</strong> {nic}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewGuide;