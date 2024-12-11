import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios;
import { DataGrid } from "@mui/x-data-grid";
import "./LocationsTable.css";
import { Link } from "react-router-dom";

const LocationsTable = () => {
  const [data, setData] = useState([]);

  const locationColumns = [
    { field: "id", headerName: "Location ID", width: 70 },
    { field: "location", headerName: "Location", width: 180 },
    { field: "province", headerName: "Province", width: 120 },
    { field: "shortDescription", headerName: "Short Description", width: 250 },
    { field: "longDescription", headerName: "Long Description", width: 290 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/viewLocation/${params.row.id}`}>
              <button className="viewButton">View</button>
            </Link>
              <button className="deleteButton" onClick={() => handleDelete(params.row.id)}>Delete</button>
          </div>
        );
      },
    },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/locations");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching location data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/locations/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting location", error);
    }
  };

  return (
    <div className="locationsTable">
      <div className="locationsTableTitle">
        <span>Locations List</span>
        <Link to="/manageLocations/addNew">
          <button className="link">Add New</button>
        </Link>
      </div>
      <DataGrid
        className="dataGrid"
        rows={data}
        columns={locationColumns.concat(actionColumn)}
        pageSize={8}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default LocationsTable;