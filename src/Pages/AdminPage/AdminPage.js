// import React, { useEffect, useState } from "react";
// import './AdminPage.css';
// import {
//   getPendingRequests,
//   updateRequestStatus,
// } from "../../services/Api";

// const AdminPage = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const { data } = await getPendingRequests();
//       setRequests(data);
//     } catch (err) {
//       console.error("Failed to fetch requests", err);
//     }
//   };

//   const handleStatusUpdate = async (id, status) => {
//     try {
//       await updateRequestStatus(id, { status });
//       fetchRequests(); // Refresh after status change
//       alert(`Request ${status.toLowerCase()} successfully.`);
//     } catch (err) {
//       alert("Failed to update request status.");
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       <h1 className="admin-title">Admin Dashboard</h1>
//       <table className="admin-table">
//         <thead className="admin-table-header">
//           <tr>
//             <th>ID</th>
//             <th>User</th>
//             <th>Type</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.map((request) => (
            
//             <tr key={request.id} className="admin-table-row">
//               <td className="admin-table-cell">#{request.id}</td>
//               <td className="admin-table-cell">{request.user.username}</td>
//               <td className="admin-table-cell">
//                 <span className="admin-type-badge">
//                   {request.type}
//                 </span>
//               </td>
//               <td className="admin-table-cell">
//                 <span className={`admin-status-badge admin-status-${request.status.toLowerCase()}`}>
//                   {request.status}
//                 </span>
//               </td>
//               <td className="admin-table-cell">
//                 <div className="admin-table-actions">
//                   <button
//                     className="admin-button admin-button-accept"
//                     onClick={() => handleStatusUpdate(request.id, "ACCEPTED")}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     className="admin-button admin-button-reject"
//                     onClick={() => handleStatusUpdate(request.id, "REJECTED")}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminPage;




import React, { useEffect, useState } from "react";
import axios from "axios";
import './AdminPage.css';
import {
  getPendingRequests,
  updateRequestStatus,
} from "../../services/Api";

const AdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // To hold request details for view
  const [showModal, setShowModal] = useState(false); // Modal visibility

  useEffect(() => {
    fetchRequests();
  }, []);

  // API function: Fetch all pending requests
  // const fetchRequests = async () => {
  //   try {
  //     const { data } = await axios.get("`http://localhost:8080/api/requests/pending");
  //     setRequests(data);
  //   } catch (err) {
  //     console.error("Failed to fetch requests", err);
  //   }
  // };

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

  // API function: Update the request status
  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/requests/${id}/status`, { status });
      fetchRequests(); // Refresh after status change
      alert(`Request ${status.toLowerCase()} successfully.`);
    } catch (err) {
      alert("Failed to update request status.");
    }
  };

  // API function: Fetch a single request's details
  const handleViewRequest = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/requests/${id}`);
      setSelectedRequest(data); // Set selected request details
      setShowModal(true); // Show modal
    } catch (err) {
      console.error("Failed to fetch request details", err);
      alert("Failed to fetch request details.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
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
                <span className="admin-type-badge">{request.type}</span>
              </td>
              <td className="admin-table-cell">
                <span
                  className={`admin-status-badge admin-status-${request.status.toLowerCase()}`}
                >
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
                  <button
                    className="admin-button admin-button-view"
                    onClick={() => handleViewRequest(request.id)}
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Request Details</h2>
            <p><strong>ID:</strong> {selectedRequest.id}</p>
            <p><strong>Username:</strong> {selectedRequest.user.username}</p>
            <p><strong>Type:</strong> {selectedRequest.type}</p>
            <p><strong>Description:</strong> {selectedRequest.description}</p>
            <p><strong>Email:</strong> {selectedRequest.email}</p>
            <p><strong>Contact Number:</strong> {selectedRequest.contactNumber}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <button
              className="admin-button admin-button-close"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
