import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewLocation.css";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const ViewLocation = () => {
    const { id } = useParams();
    const [location, setLocation] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [province, setProvince] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [extraImages, setExtraImages] = useState([null, null, null, null]);
    const [extraImagePreviews, setExtraImagePreviews] = useState([null, null, null, null]);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(true);

    const provinces = ["Central", "Western", "Uva", "North", "Southern", "Eastern"];

    useEffect(() => {
        fetchLocation();
    }, [id]);

    const fetchLocation = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/locations/${id}`);
            const data = response.data;
            setLocation(data.location);
            setShortDescription(data.shortDescription);
            setLongDescription(data.longDescription);
            setProvince(data.province);
            setMainImagePreview(data.mainImage);
            setExtraImagePreviews([data.extraImage1, data.extraImage2, data.extraImage3, data.extraImage4]);
            setCoordinates({ lat: data.latitude, lng: data.longitude });
        } catch (error) {
            console.error("Error fetching location details:", error.message);
            alert("Failed to fetch location details.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (index, file) => {
        const maxFileSize = 5 * 1024 * 1024; // 5 MB
        if (file) {
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                alert("Invalid file type. Please upload JPEG or PNG images.");
                return;
            }
            if (file.size > maxFileSize) {
                alert("File size exceeds 5 MB. Please upload a smaller image.");
                return;
            }

            if (index === -1) {
                setMainImage(file);
                setMainImagePreview(URL.createObjectURL(file));
            } else {
                const updatedImages = [...extraImages];
                const updatedPreviews = [...extraImagePreviews];
                updatedImages[index] = file;
                updatedPreviews[index] = URL.createObjectURL(file);
                setExtraImages(updatedImages);
                setExtraImagePreviews(updatedPreviews);
            }
        }
    };

    const handleLocationSelect = async (selected) => {
        const place = selected.value.description;
        setLocation(place);

        try {
            const geocodeApiKey = "YOUR_GOOGLE_API_KEY";
            const geocodeResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    place
                )}&key=${geocodeApiKey}`
            );

            const results = geocodeResponse.data.results;
            if (results.length > 0) {
                const { lat, lng } = results[0].geometry.location;
                setCoordinates({ lat, lng });
            } else {
                alert("Unable to fetch coordinates for the selected location.");
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error.message);
            alert("Failed to fetch coordinates for the selected location.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("location", location);
        formData.append("shortDescription", shortDescription);
        formData.append("longDescription", longDescription);
        formData.append("province", province);
        formData.append("latitude", coordinates.lat);
        formData.append("longitude", coordinates.lng);

        if (mainImage) {
            formData.append("mainImage", mainImage);
        }

        extraImages.forEach((img) => {
            if (img) {
                formData.append("extraImage", img);
            }
        });

        try {
            await axios.put(`http://localhost:8080/locations/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Location updated successfully!");
            fetchLocation();
        } catch (error) {
            console.error("Error updating location:", error.response || error);
            alert("An error occurred while updating the location.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
                                <label>Location:</label>
                                <GooglePlacesAutocomplete
                                    apiKey="YOUR_GOOGLE_API_KEY"
                                    selectProps={{
                                        onChange: handleLocationSelect,
                                        placeholder: "Search for a location...",
                                        defaultInputValue: location,
                                    }}
                                />
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
