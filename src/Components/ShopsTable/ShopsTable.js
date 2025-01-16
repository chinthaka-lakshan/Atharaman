import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ShopsTable.css";
import { Link } from "react-router-dom";
import axios from "axios";

const ShopsTable = () => {
  const [data, setData] = useState([]);

  const shopColumns = [
    { field: "id", headerName: "Shop ID", width: 70 },
    { field: "name", headerName: "Shop", width: 180 },
    { field: "description", headerName: "Description", width: 220 },
    { field: "contact", headerName: "Phone Number", width: 120 },
    { field: "location", headerName: "Location", width: 180 },
    { field: "province", headerName: "Province", width: 140 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/viewShop/${params.row.id}`}>
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
      const response = await axios.get("http://localhost:8080/Shops/get-all");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching shop data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/shops/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting shop", error);
    }
  };

  return (
    <div className="shopsTable">
      <div className="shopsTableTitle">
        <span>Shops List</span>
      </div>
      <DataGrid
        className="dataGrid"
        rows={data}
        columns={shopColumns.concat(actionColumn)}
        pageSize={8}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default ShopsTable;