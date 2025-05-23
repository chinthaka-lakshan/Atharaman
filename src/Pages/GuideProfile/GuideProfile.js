import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GuideProfile.css";
import ElderlySharpIcon from '@mui/icons-material/ElderlySharp';

const GuideProfile = ({ user }) => {
  const [guideDetails, setGuideDetails] = useState(null);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nic: "",
    contactNumber: "",
    description: "",
    province: "",
    selectedPlaces: [],
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const navigate = useNavigate();

  const provinces = [
    'Western',
    'Central',
    'North-Western',
    'Sabaragamuwa',
    'Uva',
    'North',
    'North-Central',
    'Southern',
    'Eastern',
  ];

  const [gId, setGId] = useState(0);

  useEffect(() => {
    // Fetch guide details
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/${user.id}`);
        const data = response.data;
        setGId(data.id);
        
        console.log(gId+"jiii");
        setGuideDetails(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          nic: data.nic || "",
          contactNumber: data.contactNumber || "",
          description: data.description || "",
          province: data.province || "",
          mainImage: data.mainImage || ElderlySharpIcon,
          selectedPlaces: data.places?.map((place) => place.id) || [],
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load guide details. Please try again later.");
        setLoading(false);
      }
    };

    // Fetch available places
    const fetchAvailablePlaces = async () => {
      try {
        const response = await axios.get("http://localhost:8080/locations");
        setAvailablePlaces(response.data);
      } catch (err) {
        console.error("Error fetching places:", err);
      }
    };

    if (user && user.role === "GUIDE") {
      fetchGuideDetails();
      fetchAvailablePlaces();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, file) => {
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      alert("Invalid file type. Please upload JPEG or PNG images.");
      return;
    }
  
    if (index === -1) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // const handlePlaceSelection = (e) => {
  //   const { value, checked } = e.target;
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     selectedPlaces: checked
  //       ? [...prevState.selectedPlaces, parseInt(value)]
  //       : prevState.selectedPlaces.filter((id) => id !== parseInt(value)),
  //   }));
  //   console.log(prevState.selectedPlaces[0].id+"place");
    
  // };


  const handlePlaceSelection = (e) => {
    const { value, checked } = e.target;
  
    setFormData((prevState) => {
      const updatedPlaces = checked
        ? [...prevState.selectedPlaces, parseInt(value)]
        : prevState.selectedPlaces.filter((id) => id !== parseInt(value));
  
      // Logging the updated places array
      console.log(updatedPlaces, "updated selected places");
  
      return {
        ...prevState,
        selectedPlaces: updatedPlaces,
      };
    });
  };
  

  const handleSave = async () => {
    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("email", formData.email);
      updateData.append("nic", formData.nic);
      updateData.append("contactNumber", formData.contactNumber);
      updateData.append("description", formData.description);
      updateData.append("province", formData.province);
      //updateData.append("placeIds", JSON.stringify(formData.selectedPlaces));
      updateData.append("placeIds", formData.selectedPlaces);

      if (mainImage) updateData.append("mainImage", mainImage);

      const response = await axios.put(`http://localhost:8080/api/guides/${gId}`, updateData);

      setGuideDetails(response.data);
      setEditing(false);
      alert("Profile updated successfully.");
      navigate("/");
    } catch (err) {
      alert("Failed to update profile. Please try again later.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        await axios.delete(`http://localhost:8080/api/guides/${user.id}`);
        alert("Profile deleted successfully.");
        navigate("/");
      } catch (err) {
        alert("Failed to delete profile. Please try again later.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="guide-profile">
      <div className="guide-profile-container">
        {guideDetails ? (
          <>
            <div className="top">
              <h1>Guide Profile</h1>
              <div className="imageGallery">
                {mainImagePreview && <img src={mainImagePreview} alt="Main" />}
              </div>
              <div className="guide-details">
                <p><strong>Name:</strong> {guideDetails.name}</p>
                <p><strong>Email:</strong> {guideDetails.email}</p>
                <p><strong>NIC:</strong> {guideDetails.nic}</p>
                <p><strong>Contact Number:</strong> {guideDetails.contactNumber}</p>
                <p><strong>Description:</strong> {guideDetails.description}</p>
                <p><strong>Province:</strong> {guideDetails.province}</p>
                <p><strong>Places:</strong> {guideDetails.places?.map((p) => p.location).join(", ") || "None"}</p>
              </div>
              <div className="guide-actions">
                <button onClick={() => setEditing(true)} className="edit-button">
                  Edit Profile
                </button>
                <button onClick={handleDelete} className="delete-button">
                  Delete Profile
                </button>
              </div>
            </div>

            {editing && (
              <div className="bottom">
                <h1>Edit Guide Profile</h1>
                <form className="eForm">
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
                  </div>
                  <div className="formDetails">
                    <div className="editFormInput">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                      />
                    </div>
                    <div className="editFormInput">
                      <label>Description:</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                      />
                    </div>
                    <div className="editFormInput">
                      <label>E-Mail:</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                      />
                    </div>
                    <div className="editFormInput">
                      <label>NIC:</label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleInputChange}
                        placeholder="NIC"
                      />
                    </div>
                    <div className="editFormInput">
                      <label>Contact No:</label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Contact Number"
                      />
                    </div>
                  </div>
                  <div className="formSelect">
                    <label htmlFor="province">Province:</label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select a province
                      </option>
                      {provinces.map((province, index) => (
                        <option key={index} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="formRadio">
                    <label>Guiding Places:</label>
                    <div className="places">
                      {availablePlaces.map((place) => (
                        <div key={place.id} className="radioInput">
                          <input
                            type="checkbox"
                            value={place.id}
                            checked={formData.selectedPlaces.includes(place.id)}
                            onChange={handlePlaceSelection}
                          />
                          <label>{place.location}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="buttons">
                    <button type="button" className="saveButton" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button type="button" className="cancelButton" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <p>No details available.</p>
        )}
      </div>
    </div>
  );
};

export default GuideProfile;