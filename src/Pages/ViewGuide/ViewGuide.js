import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewGuide.css";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";

const ViewGuide = () => {
    const { id } = useParams(); // Extracting ID from route parameters
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

            // Update state with fetched data
            setGuideDetails({
                name: data.name || '',
                description: data.description || '',
                contactNumber: data.contactNumber || '',
                email: data.email || '',
                nic: data.nic || '',
                // mainImage: null, // Placeholder for the image upload
            });

            // if (data.mainImage) {
            //     setMainImagePreview(data.mainImage); // Assuming backend provides an image URL
            // }
        } catch (error) {
            console.error("Error fetching guide details:", error.message);
            alert("Failed to fetch guide details. Please check the console for more information.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuideDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file && !["image/jpeg", "image/png"].includes(file.type)) {
    //         alert("Invalid file type. Please upload a JPEG or PNG image.");
    //         return;
    //     }

    //     setGuideDetails((prevState) => ({
    //         ...prevState,
    //         mainImage: file,
    //     }));

    //     setMainImagePreview(URL.createObjectURL(file));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", guideDetails.name);
        formData.append("description", guideDetails.description);
        formData.append("contactNumber", guideDetails.contactNumber);
        formData.append("email", guideDetails.email);
        formData.append("nic", guideDetails.nic);

        // if (guideDetails.mainImage) {
        //     formData.append("mainImage", guideDetails.mainImage);
        // }

        try {
            await axios.put(`http://localhost:8080/api/guides/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Guide updated successfully!");
            fetchGuideDetails(); // Refresh the details
        } catch (error) {
            console.error("Error updating guide:", error.message);
            alert("Failed to update guide details. Please check the console for more information.");
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
                <div className="bottom">
                    <h2>Edit Guide</h2>
                    <form className="eForm" onSubmit={handleSubmit}>
                        {/* <div className="formImages">
                            <div className="mainImage">
                                <label htmlFor="mainImageInput">Main Image</label>
                                <input
                                    id="mainImageInput"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                {mainImagePreview && <img src={mainImagePreview} alt="Main Preview" />}
                            </div>
                        </div> */}
                        <div className="formDetails">
                            <div className="editFormInput">
                                <label>Guide Name:</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={guideDetails.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="editFormInput">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={guideDetails.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="editFormInput">
                                <label>Phone No:</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={guideDetails.contactNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="editFormInput">
                                <label>E-Mail:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={guideDetails.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="editFormInput">
                                <label>NIC:</label>
                                <input
                                    type="text"
                                    name="nic"
                                    value={guideDetails.nic}
                                    onChange={handleInputChange}
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
