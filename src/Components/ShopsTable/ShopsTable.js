import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ShopsTable.css";
import { shopRows } from "../../shopsTableSource";
import { Link } from "react-router-dom";

const ShopsTable = () => {
  const [data, setData] = useState(shopRows);

  const shopColumns = [
    { field: "id", headerName: "Shop ID", width: 70 },
    {
      field: "shop",
      headerName: "Shop",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.img} alt="avatar" />
            {params.row.shop}
          </div>
        );
      },
    },
    { field: "description", headerName: "Description", width: 180 },
    { field: "shopLocation", headerName: "Location", width: 100 },
    { field: "phoneNo", headerName: "Phone Number", width: 100 },
    { field: "email", headerName: "E-Mail", width: 100 },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to='/manageShops/:id'><span className="viewButton">View</span></Link>
            <div className="deleteButton">Delete</div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="shopsTable">
      <div className="shopsTableTitle">
        <span>Shops List</span>
        <Link to='/manageShops/addNew'><span className="link">Add New</span></Link>
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