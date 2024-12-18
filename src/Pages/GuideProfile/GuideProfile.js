import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GuideProfile.css";

const GuideProfile = ({ user }) => {
  const [guideDetails, setGuideDetails] = useState(null);
  const [availablePlaces, setAvailablePlaces] = useState([]); // Fixed: Defined availablePlaces
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nic: "",
    contactNumber: "",
    description: "",
    selectedPlaces: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch guide details
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/${user.id}`);
        setGuideDetails(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          nic: response.data.nic || "",
          contactNumber: response.data.contactNumber || "",
          description: response.data.description || "",
          selectedPlaces: response.data.places?.map((place) => place.id) || [],
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
        setAvailablePlaces(response.data); // Fixed: Set available places
      } catch (err) {
        console.error("Error fetching places:", err);
      }
    };

    if (user && user.role === "GUIDE") {
      fetchGuideDetails();
      fetchAvailablePlaces();
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle place selection for checkboxes
  const handlePlaceSelection = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      if (checked) {
        return { ...prevState, selectedPlaces: [...prevState.selectedPlaces, parseInt(value)] };
      } else {
        return {
          ...prevState,
          selectedPlaces: prevState.selectedPlaces.filter((id) => id !== parseInt(value)),
        };
      }
    });
  };

  // Save changes to the profile
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/guides/${user.id}`,
        { ...formData, placeIds: formData.selectedPlaces }
      );
      setGuideDetails(response.data);
      setEditing(false);
      alert("Profile updated successfully.");
    } catch (err) {
      alert("Failed to update profile. Please try again later.");
    }
  };

  // Delete profile
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (confirmDelete) {
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
        <h2>Guide Profile</h2>
        {guideDetails ? (
          editing ? (
            <div className="edit-form">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                NIC:
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Contact Number:
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </label>
              <div className="form-group">
                <label>Places:</label>
                <div className="checkbox-group">
                  {availablePlaces.length > 0 ? (
                    availablePlaces.map((place) => (
                      <div key={place.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`place-${place.id}`}
                          value={place.id}
                          checked={formData.selectedPlaces.includes(place.id)}
                          onChange={handlePlaceSelection} // Fixed: Added onChange handler
                        />
                        <label htmlFor={`place-${place.id}`}>{place.location}</label>
                      </div>
                    ))
                  ) : (
                    <p>No available places found.</p>
                  )}
                </div>
              </div>
              <div className="guide-actions">
                <button onClick={handleSave} className="save-button">
                  Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="guide-details">
              <p><strong>Name:</strong> {guideDetails.name}</p>
              <p><strong>Email:</strong> {guideDetails.email}</p>
              <p><strong>NIC:</strong> {guideDetails.nic}</p>
              <p><strong>Contact Number:</strong> {guideDetails.contactNumber}</p>
              <p><strong>Description:</strong> {guideDetails.description}</p>
              <p>
                <strong>Places:</strong>{" "}
                {guideDetails.places?.length > 0
                  ? guideDetails.places.map((place) => place.location).join(", ")
                  : "No places assigned."}
              </p>

              <div className="guide-actions">
                <button onClick={() => setEditing(true)} className="edit-button">
                  Edit Profile
                </button>
                <button onClick={handleDelete} className="delete-button">
                  Delete Profile
                </button>
              </div>
            </div>
          )
        ) : (
          <p>No details available.</p>
        )}
      </div>
    </div>
  );
};

export default GuideProfile;
