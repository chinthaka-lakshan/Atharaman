import React, { useEffect, useState } from "react";
import './AdminPage.css';
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import {
  getPendingRequests,
  updateRequestStatus,
} from "../../services/Api";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";

const AdminPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateRequestStatus(id, { status });
      fetchRequests(); // Refresh after status change
      alert(`Request ${status.toLowerCase()} successfully.`);
    } catch (err) {
      alert("Failed to update request status.");
    }
  };

  return (
    <div className="adminDashboard">
      <AdminSidebar/>
      <div className="adminDashboardContainer">
        <AdminNavbar/>
        <div className="admin-dashboard">
          <h1 className="admin-title">Admin Dashboard</h1>
          <table className="admin-table">
            <thead className="admin-table-header">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                
                <tr key={request.id} className="admin-table-row">
                  <td className="admin-table-cell">#{request.id}</td>
                  <td className="admin-table-cell">{request.user.username}</td>
                  <td className="admin-table-cell">
                    <span className="admin-type-badge">
                      {request.type}
                    </span>
                  </td>
                  <td className="admin-table-cell">
                    <span className={`admin-status-badge admin-status-${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="admin-table-cell">
                    <div className="admin-table-actions">
                      <button
                        className="admin-button admin-button-accept"
                        onClick={() => handleStatusUpdate(request.id, "ACCEPTED")}
                      >
                        Accept
                      </button>
                      <button
                        className="admin-button admin-button-reject"
                        onClick={() => handleStatusUpdate(request.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
    </div>
  );
};

export default AdminPage;