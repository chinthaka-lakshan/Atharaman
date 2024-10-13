import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { DataGrid } from "@mui/x-data-grid";
import "./LocationsTable.css";
import { Link } from "react-router-dom";

const LocationsTable = () => {
  const [data, setData] = useState([]); // Initialize state for location data

  // Define columns for the DataGrid
  const locationColumns = [
    { field: "id", headerName: "Location ID", width: 70 },
    {
      field: "location",
      headerName: "Location",
      width: 180,
    },
    { field: "shortDescription", headerName: "Short Description", width: 180 },
    { field: "longDescription", headerName: "Long Description", width: 250 },
    { field: "province", headerName: "Province", width: 120 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/viewLocation/${params.row.id}`}>
              <span className="viewButton">View</span>
            </Link>
            <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>Delete</div>
          </div>
        );
      },
    },
  ];

  // Function to fetch location data
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/atharaman"); // Update with your Spring Boot URL
      setData(response.data); // Update state with the fetched data
    } catch (error) {
      console.error("Error fetching location data", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/atharaman/${id}`); // Call delete API
      setData(data.filter((item) => item.id !== id)); // Update state to remove deleted item
    } catch (error) {
      console.error("Error deleting location", error);
    }
  };

  return (
    <div className="locationsTable">
      <div className="locationsTableTitle">
        <span>Locations List</span>
        <Link to="/admin/manageLocations/addNew">
          <span className="link">Add New</span>
        </Link>
      </div>
      <DataGrid
        className="dataGrid"
        rows={data}
        columns={locationColumns.concat(actionColumn)}
        pageSize={8}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id} // Ensures unique row IDs
      />
    </div>
  );
};

export default LocationsTable;
