
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL of the backend
});

async function fetchUsernames(reviews) {
  try {
    const userIds = reviews.map((review) => review.userId);
    const response = await API.post("/users/getUsernames", { userIds }); // Use the base API instance
    const userMap = response.data; // Example: { 123: "JohnDoe", 456: "JaneSmith" }
    return reviews.map((review) => ({
      ...review,
      username: userMap[review.userId] || "Anonymous", // Add username to each review
    }));
  } catch (error) {
    console.error("Error fetching usernames:", error.message);
    return reviews; // Return original reviews if an error occurs
  }
}

export { fetchUsernames }; // Export the function

// User Registration
export const registerUser = (userData) => API.post('/users/register', userData);

// User Login
export const loginUser = (loginData) => API.post('/users/login', loginData);
export const sendVerificationCode = (loginData) => API.post('/users/forgot-password', loginData);

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
export const getGuideProfile = (id) => {
  return axios.get(`/api/guides/id/${id}`);
};

// Fetch shop owner profile by userId
export const getShopOwnerProfile = (userId) => {
  return axios.get(`/api/shop-owners/${userId}`);
};

export const deleteUser = (userId) => API.delete(`users/${userId}`);

// New API functions for fetching guides and shop owners
export const getGuides = () => API.get('/guides');
export const getShopOwners = () => API.get('shop-owners');

// Forgot Password - Send OTP
export const sendOTP = (emailData) => API.post('/users/forgot-password', emailData);

// Reset Password
export const resetPassword = (resetData) => API.post('/users/reset-password', resetData);
