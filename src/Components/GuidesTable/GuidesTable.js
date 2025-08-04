import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./GuidesTable.css";
import { Link } from "react-router-dom";
import axios from "axios";

const GuidesTable = () => {
  const [data, setData] = useState([]);

  // Fetch guides from the backend
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
      `Are you sure you want to delete the guide with ID ${id}?`
    );

    if (!userConfirmed) {
      alert("Deletion canceled.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/guides/${id}`);
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

  const guideColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "guideName", headerName: "Name", width: 180 },
    { field: "businessMail", headerName: "Business Email", width: 200 },
    { field: "personalNumber", headerName: "Personal No", width: 150 },
    { field: "whatsappNumber", headerName: "WhatsApp No", width: 150 },
    { field: "location", headerName: "Location", width: 150},
    {
      field: "languages",
      headerName: "Languages",
      width: 180,
      renderCell: (params) => params.row.languages?.join(", "),
    },
    { field: "description", headerName: "Description", width: 200 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 160,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/viewGuide/${params.row.id}`}>
            <button className="viewButton">View</button>
          </Link>
          <button
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="guidesTable">
      <div className="guidesTableTitle">
        <span>Registered Guides</span>
        <Link to="/manageGuides/addNew">
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
