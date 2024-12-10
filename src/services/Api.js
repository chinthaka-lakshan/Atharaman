
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL of the backend
});

// User Registration
export const registerUser = (userData) => API.post('/users/register', userData);

// User Login
export const loginUser = (loginData) => API.post('/users/login', loginData);

// Get User Profile
export const getUserProfile = (id) => API.get(`/users/${id}`);

// Submit Request (Guide or Shop Owner)
//export const submitRequest = (requestData) => API.post('/requests', requestData);
export const submitRequest = (requestData) =>API.post('/requests/create', requestData, {
        params: { userId: requestData.userId },
    });



// Update user profile
export const updateUser = (id, updateData) => API.put(`/users/${id}`, updateData);

// Fetch all pending requests
export const getPendingRequests = () =>
  API.get(`/requests/pending`);
// Update request status (ACCEPTED/REJECTED)
export const updateRequestStatus = (id, payload) =>
  API.put(`/requests/${id}/status`, payload);

// Fetch guide profile by userId
export const getGuideProfile = (userId) => {
  return axios.get(`/api/guides/${userId}`);
};

// Fetch shop owner profile by userId
export const getShopOwnerProfile = (userId) => {
  return axios.get(`/api/shop-owners/${userId}`);
};




// New API functions for fetching guides and shop owners
export const getGuides = () => API.get('/guides');
export const getShopOwners = () => API.get('shop-owners');


