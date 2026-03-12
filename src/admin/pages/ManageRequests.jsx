import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import RequestView from '../components/views/RequestView';
import { getAdminRoleRequests, getRoleRequestStatistics, approveRoleRequest, rejectRoleRequest } from '../../services/api';
import { Eye, CheckCircle, XCircle, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ManageRequests = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    total: 0
  });

  const { user } = useAuth();

  // Fetch statistics separately
  const fetchStatistics = async () => {
    try {
      const response = await getRoleRequestStatistics();
      setStatusCounts(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Fetch requests (only pending for the table)
  const fetchRequests = async () => {
    try {
      const response = await getAdminRoleRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both statistics and requests
  const fetchAllData = async () => {
    await Promise.all([fetchStatistics(), fetchRequests()]);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAccept = async (request) => {
    if (!window.confirm(`Are you sure you want to accept the ${request.requestType.replace('_', ' ')} request from "${request.applicantName}"?`)) {
      return;
    }

    setActionLoading(request.id);
    try {
      // Update counts optimistically
      setStatusCounts(prev => ({
        total: prev.total,
        pending: prev.pending - 1,
        accepted: prev.accepted + 1,
        rejected: prev.rejected
      }));

      await approveRoleRequest(request.id);
      await fetchAllData(); // Refresh both stats and requests
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request: ' + (error.response?.data?.message || error.message));
      await fetchAllData(); // Refresh to get correct state
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (request) => {
    if (!window.confirm(`Are you sure you want to reject the ${request.requestType.replace('_', ' ')} request from "${request.applicantName}"?`)) {
      return;
    }

    setActionLoading(request.id);
    try {
      // Update counts optimistically
      setStatusCounts(prev => ({
        total: prev.total,
        pending: prev.pending - 1,
        accepted: prev.accepted,
        rejected: prev.rejected + 1
      }));

      await rejectRoleRequest(request.id);
      await fetchAllData(); // Refresh both stats and requests
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request: ' + (error.response?.data?.message || error.message));
      await fetchAllData(); // Refresh to get correct state
    } finally {
      setActionLoading(null);
    }
  };

  // Flatten the data for the table to handle nested properties
  const flattenedRequests = requests.map(request => ({
    id: request.id,
    requestType: request.role?.name || 'Unknown',
    applicantName: request.user?.name || 'Unknown',
    status: request.status,
    submittedDate: request.created_at,
    // Include the full request object for actions and modal
    _rawData: request
  }));

  const columns = [
    { 
      key: 'requestType', 
      label: 'Request Type', 
      sortable: true, 
      render: (value) => (
        <span className="capitalize font-medium text-gray-900">
          {value.replace('_', ' ')}
        </span>
      )
    },
    { 
      key: 'applicantName', 
      label: 'Applicant Name', 
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true, 
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
          value === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
          'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { 
      key: 'submittedDate', 
      label: 'Submitted', 
      sortable: true, 
      render: (value) => (
        <div className="text-sm text-gray-600">
          <div>{new Date(value).toLocaleDateString()}</div>
          <div className="text-xs text-gray-400">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      )
    },
  ];

  const handleView = (request) => {
    setSelectedRequest(request._rawData);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Role Requests</h1>
        <p className="text-gray-600 mt-1">Review and manage business role registration requests</p>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Pending: {statusCounts.pending}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Accepted: {statusCounts.accepted}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Rejected: {statusCounts.rejected}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Total: {statusCounts.total}</span>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <User className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <p className="text-gray-500 text-lg">No role requests found.</p>
          <p className="text-gray-400 text-sm mt-1">When users submit role requests, they will appear here.</p>
        </div>
      ) : (
        <>
          <DataTable
            data={flattenedRequests}
            columns={columns}
            onView={handleView}
            customActions={(request) => (
              <div className="flex items-center space-x-2">
                {/* View Button */}
                <button
                  onClick={() => handleView(request)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                  title="View Request Details"
                >
                  <Eye size={16} />
                  <span className="text-sm">View</span>
                </button>

                {/* Accept/Reject Buttons (only for pending requests and admin users) */}
                {request.status === 'pending' && user?.role === 'Admin' && (
                  <>
                    <button
                      onClick={() => handleAccept(request)}
                      disabled={actionLoading === request.id}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-800 px-3 py-2 rounded hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Accept Request"
                    >
                      {actionLoading === request.id ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      <span className="text-sm">Accept</span>
                    </button>
                    <button
                      onClick={() => handleReject(request)}
                      disabled={actionLoading === request.id}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800 px-3 py-2 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Reject Request"
                    >
                      {actionLoading === request.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <XCircle size={16} />
                      )}
                      <span className="text-sm">Reject</span>
                    </button>
                  </>
                )}
                
                {/* Status indicator for non-pending requests */}
                {request.status !== 'pending' && (
                  <span className={`text-sm font-medium ${
                    request.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                  </span>
                )}
              </div>
            )}
          />

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Request Details"
            size="large"
          >
            {selectedRequest && (
              <RequestView 
                request={selectedRequest} 
                onActionComplete={() => {
                  setShowModal(false);
                  fetchRequests();
                }}
              />
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default ManageRequests;