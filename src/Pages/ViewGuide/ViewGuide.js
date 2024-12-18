import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewGuide.css";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";

const ViewGuide = () => {
    const { id } = useParams();
    const [guideDetails, setGuideDetails] = useState({
        username: '',
        description: '',
        contactNumber: '',
        email: '',
        nic: '',
        mainImage: null,
    });
    const [mainImagePreview, setMainImagePreview] = useState(null);

    useEffect(() => {
        fetchGuideDetails();
    }, [id]);

    const fetchGuideDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/guides/id/${id}`);
            const data = response.data;

            setGuideDetails({
                name: data.name || '',
                description: data.description || '',
                contactNumber: data.contactNumber || '',
                email: data.email || '',
                nic: data.nic || '',
                // mainImage: null,
            });

            // if (data.mainImage) {
            //     setMainImagePreview(data.mainImage); // Assuming backend provides an image URL
            // }
        } catch (error) {
            console.error("Error fetching guide details:", error.message);
            alert("Failed to fetch guide details. Please check the console for more information.");
        }
    };

    return (
        <div className="viewGuide">
            <AdminSidebar />
            <div className="viewGuideContainer">
                <AdminNavbar />
                <div className="top">
                    <h1>Guide Details</h1>
                    {/* <div className="imageGallery">
                        {mainImagePreview && <img src={mainImagePreview} alt="Guide" />}
                    </div> */}
                    <div className="details">
                        <p><strong>Guide ID:</strong> {id}</p>
                        <p><strong>Guide Name:</strong> {guideDetails.name}</p>
                        <p><strong>Description:</strong> {guideDetails.description}</p>
                        <p><strong>Phone No:</strong> {guideDetails.contactNumber}</p>
                        <p><strong>E-Mail:</strong> {guideDetails.email}</p>
                        <p><strong>NIC:</strong> {guideDetails.nic}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewGuide;