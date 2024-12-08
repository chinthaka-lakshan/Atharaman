import React, { useState } from 'react';
import './AddNewLocation.css';
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import { DriveFolderUploadOutlined, Close } from "@mui/icons-material";

const AddNewLocation = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);

  const handleImageChange = (setImage, e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file && !allowedTypes.includes(file.type)) {
      alert(`Invalid file type: ${file.name}. Please upload JPEG or PNG images only.`);
      return;
    }

    setImage(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", {
      image1,
      image2,
      image3,
      image4,
      image5,
    });

    // Reset all images
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setImage5(null);
    e.target.reset();
  };

  const provinces = ["Central", "Western", "Uva", "North", "Southern", "Eastern"];

  return (
    <div className="addNewLocation">
      <AdminSidebar />
      <div className="addNewLocationContainer">
        <AdminNavbar />
        <div className="top">
          <h1>ADD NEW LOCATION</h1>
        </div>
        <div className="bottom">
          <div className="left">
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
                    <LocationOnSharpIcon className="placeholder" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="right">
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
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewLocation;