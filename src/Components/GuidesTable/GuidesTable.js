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
        const response = await axios.get("http://localhost:8080/guides");
        setData(response.data); // set the guides data
      } catch (error) {
        console.error("Error fetching guides data", error);
      }
    };

    fetchGuides();
  }, []);

  const guideColumns = [
    { field: "id", headerName: "Guide ID", width: 70 },
    {
      field: "guideName",
      headerName: "Guide",
      width: 180,
      renderCell: (params) => {
      },
    },
    { field: "description", headerName: "Description", width: 180 },
    { field: "phoneNo", headerName: "Phone Number", width: 100 },
    { field: "email", headerName: "E-Mail", width: 100 },
    { field: "nic", headerName: "NIC", width: 100 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/viewGuide/${params.row.id}`}>
              <span className="viewButton">View</span>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  // Handle delete guide
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/guides/${id}`);
      setData(data.filter((item) => item.id !== id)); // Remove the deleted guide from the table
    } catch (error) {
      console.error("Error deleting guide", error);
    }
  };

  return (
    <div className="guidesTable">
      <div className="guidesTableTitle">
        <span>Guides List</span>
        <Link to='/manageGuides/addNew'>
          <span className="link">Add New</span>
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
