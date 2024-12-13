import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./GuidesTable.css";
import { Link } from "react-router-dom";
import axios from "axios";

const GuidesTable = () => {
  const [data, setData] = useState([]);

  // Fetch guides from the backend
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/guides");
        setData(response.data); // set the guides data
      } catch (error) {
        console.error("Error fetching guides data", error);
      }
    };

    fetchGuides();
  }, []);

  const guideColumns = [
    { field: "id", headerName: "Guide ID", width: 70 },
    { field: "name", headerName: "Guide", width: 180 },
    { field: "description", headerName: "Description", width: 220 },
    { field: "contactNumber", headerName: "Phone Number", width: 120 },
    { field: "email", headerName: "E-Mail", width: 180 },
    { field: "nic", headerName: "NIC", width: 140 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/viewGuide/${params.row.id}`}>
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
      const response = await axios.get("http://localhost:8080/api/guides");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching guide data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(
        `Are you sure you want to delete the guide?`
    );

    if (!userConfirmed) {
        alert("Deletion canceled.");
        return;
    }

    try {
        await axios.delete(`http://localhost:8080/api/guides/${id}`);
        // Update the state to remove the deleted guide
        setData((prevData) => prevData.filter((item) => item.id !== id));
        alert(`Guide with ID ${id} has been successfully deleted.`);
    } catch (error) {
        console.error("Error deleting guide:", error);
        alert(
            `Failed to delete guide with ID ${id}. ${
                error.response?.data?.message || "Please try again later."
            }`
        );
    }
};


  return (
    <div className="guidesTable">
      <div className="guidesTableTitle">
        <span>Guides List</span>
        <Link to='/manageGuides/addNew'>
          <button className="link">Add New</button>
        </Link>
      </div>
      <DataGrid
        className="dataGrid"
        rows={data}
        columns={guideColumns.concat(actionColumn)}
        pageSize={8}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default GuidesTable;
