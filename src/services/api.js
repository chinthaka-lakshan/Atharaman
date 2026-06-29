import axios from 'axios';
import { API_BASE_URL } from '../config/runtimeConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to include auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && !config.url.includes('/login') && !config.url.includes('/register')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Password reset APIs
export const sendResetLink = (emailData) => api.post('/forgot-password', emailData);
export const resetPassword = (resetData) => api.post('/reset-password', resetData);
// Review APIs
export const getReviewsByEntity = (entityType, entityId) => api.get(`/reviews/entity/${entityType}/${entityId}`);
export const getReviews = () => api.get('/reviews');
export const getReview = (id) => api.get(`/reviews/${id}`);
export const createReview = (formData) => api.post('/reviews', formData, {headers: {'Content-Type': 'multipart/form-data'}});
export const updateReview = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/reviews/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// export const updateReview = (id, formData) => api.put(`/reviews/${id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const getUserReviews = () => api.get('/user/reviews');
// Website Review APIs
export const getWebsiteReviews = () => api.get('/website-reviews');
export const getWebsiteReview = (id) => api.get(`/website-reviews/${id}`);
export const createWebsiteReview = (data) => api.post('/website-reviews', data);
export const updateWebsiteReview = (id, data) => api.post(`/website-reviews/${id}`, data);
export const deleteWebsiteReview = (id) => api.delete(`/website-reviews/${id}`);
export const getUserWebsiteReviews = () => api.get('/user/website-reviews');
export const getRecentWebsiteReviews = (limit = 10) => api.get(`/website-reviews/recent/${limit}`);
// Role Request APIs (User)
export const checkNicAvailability = (data) => api.post('/check-nic-availability', data);
export const requestRole = (roleData) => api.post('/role-request', roleData);
export const getRoleRequests = () => api.get('/user/role-requests');
export const getPendingRoleRequests = () => api.get('/role-requests/pending');
export const getRoleRequest = (id) => api.get(`/role-requests/${id}`);
export const cancelRoleRequest = (id) => api.delete(`/role-requests/${id}`);
export const getAvailableRoles = () => api.get('/role-requests/available-roles');
// User item APIs
export const getMyItems = () => api.get('/my-items');
export const getItemsByAuthenticatedShop = (shopId) => api.get(`/my-shops/${shopId}/items`);
export const createMyItem = (formData) => api.post('/my-items', formData, {headers: {'Content-Type': 'multipart/form-data'}});
export const updateMyItem = (id, formData) => api.put(`/my-items/${id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
export const deleteMyItem = (id) => api.delete(`/my-items/${id}`);


// PUBLIC APIs (No Auth Required)
// Public register & login APIs
export const registerUser = (userData) => api.post('/register', userData);
export const loginUser = (credentials) => api.post('/login', credentials);
// Public location APIs
export const getLocations = () => api.get('/locations');
export const getLocationById = (id) => api.get(`/locations/${id}`);
export const getLocationsByProvince = (province) => api.get(`/locations/province/${province}`);
export const getRelatedData = (locationId) => api.get(`/locations/${locationId}/related-data`);
// Public Guide APIs
export const getGuides = () => api.get('/guides');
export const getGuideById = (id) => api.get(`/guides/${id}`);
export const getGuidesByLocation = (location) => api.get(`/guides/location/${location}`);
// Public shop owner APIs
export const getShopOwners = () => api.get('/shop-owners');
export const getShopOwnerById = (id) => api.get(`/shop-owners/${id}`);
// Public shop APIs
export const getShops = () => api.get('/shops');
export const getShopById = (id) => api.get(`/shops/${id}`);
export const getShopsByOwner = (ownerId) => api.get(`/shop-owners/${ownerId}/shops`);
export const getShopsByLocation = (location) => api.get(`/shops/location/${location}`);
// Public hotel owner APIs
export const getHotelOwners = () => api.get('/hotel-owners');
export const getHotelOwnerById = (id) => api.get(`/hotel-owners/${id}`);
// Public hotel APIs
export const getHotels = () => api.get('/hotels');
export const getHotelById = (id) => api.get(`/hotels/${id}`);
export const getHotelsByOwner = (ownerId) => api.get(`/hotel-owners/${ownerId}/hotels`);
export const getHotelsByLocation = (location) => api.get(`/hotels/location/${location}`);
// Public vehicle owner APIs
export const getVehicleOwners = () => api.get('/vehicle-owners');
export const getVehicleOwnerById = (id) => api.get(`/vehicle-owners/${id}`);
export const getVehicleOwnersByLocation = (location) => api.get(`/vehicle-owners/location/${location}`);
// Public vehicle APIs
export const getVehicles = () => api.get('/vehicles');
export const getVehicleById = (id) => api.get(`/vehicles/${id}`);
export const getVehiclesByOwner = (ownerId) => api.get(`/vehicle-owners/${ownerId}/vehicles`);
export const getVehiclesByLocation = (location) => api.get(`/vehicles/location/${location}`);


// USER APIs (Auth Required)
// User profile & logout APIs
export const getProfile = () => api.get('/user/profile');
export const logoutUser = () => api.post('/logout');
// User guide APIs
export const getMyGuide = () => api.get('/my-guide');
export const updateMyGuide = (data) => {
  data.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post('/my-guide', data, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
};
export const deleteMyGuide = () => api.delete('/my-guide');
// User shop owner APIs
export const getMyShopOwner = () => api.get('/my-shop-owner');
export const updateMyShopOwner = (data) => api.put('/my-shop-owner', data);
export const deleteMyShopOwner = () => api.delete('/my-shop-owner');
// User shop APIs
export const getMyShops = () => api.get('/my-shops');
export const createMyShop = (formData) => api.post('/my-shops', formData, {headers: {'Content-Type': 'multipart/form-data'}});
export const updateMyShop = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/my-shops/${id}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
};
export const deleteMyShop = (id) => api.delete(`/my-shops/${id}`);
// User hotel owner APIs
export const getMyHotelOwner = () => api.get('/my-hotel-owner');
export const updateMyHotelOwner = (data) => api.put('/my-hotel-owner', data);
export const deleteMyHotelOwner = () => api.delete('/my-hotel-owner');
// User hotel APIs
export const getMyHotels = () => api.get('/my-hotels');
export const createMyHotel = (formData) => api.post('/my-hotels', formData, {headers: {'Content-Type': 'multipart/form-data'}});
export const updateMyHotel = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/my-hotels/${id}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
};
export const deleteMyHotel = (id) => api.delete(`/my-hotels/${id}`);
// User vehicle owner APIs
export const getMyVehicleOwner = () => api.get('/my-vehicle-owner');
export const updateMyVehicleOwner = (data) => api.put('/my-vehicle-owner', data);
export const deleteMyVehicleOwner = () => api.delete('/my-vehicle-owner');
// User vehicle APIs
export const getMyVehicles = () => api.get('/my-vehicles');
export const checkRegistrationNumberAvailability = (data) => api.post('/check-registration-number-availability', data);
export const createMyVehicle = (formData) => api.post('/my-vehicles', formData, {headers: {'Content-Type': 'multipart/form-data'}});
export const updateMyVehicle = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/my-vehicles/${id}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
};
export const deleteMyVehicle = (id) => api.delete(`/my-vehicles/${id}`);


// ADMIN ONLY APIs
// Admin only location APIs
export const createLocation = (formData) => {return api.post('/locations', formData, {headers: {'Content-Type': 'multipart/form-data'}});};
export const updateLocation = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/locations/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteLocation = (id) => api.delete(`/locations/${id}`);
// Admin only guide APIs
export const createGuide = (formData) => {return api.post('/guides', formData, {headers: {'Content-Type': 'multipart/form-data'}});};
export const updateGuide = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/guides/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteGuide = (id) => api.delete(`/guides/${id}`);
// Admin only shop Owner APIs
export const createShopOwner = (formData) => api.post('/shop-owners', formData);
export const updateShopOwner = (id, formData) => api.put(`/shop-owners/${id}`, formData);
export const deleteShopOwner = (id) => api.delete(`/shop-owners/${id}`);
// Admin only shop APIs
export const createShop = (formData) => {return api.post('/shops', formData, {headers: {'Content-Type': 'multipart/form-data'}});};
export const updateShop = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/shops/${id}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
};
export const deleteShop = (id) => api.delete(`/shops/${id}`);
// Admin only hotel Owner APIs
export const createHotelOwner = (formData) => api.post('/hotel-owners', formData);
export const updateHotelOwner = (id, formData) => api.put(`/hotel-owners/${id}`, formData);
export const deleteHotelOwner = (id) => api.delete(`/hotel-owners/${id}`);
// Admin only hotel APIs
export const createHotel = (formData) => {return api.post('/hotels', formData, {headers: {'Content-Type': 'multipart/form-data'}});};
export const updateHotel = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/hotels/${id}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
};
export const deleteHotel = (id) => api.delete(`/hotels/${id}`);
// Admin only vehicle Owner APIs
export const createVehicleOwner = (formData) => api.post('/vehicle-owners', formData);
export const updateVehicleOwner = (id, formData) => api.put(`/vehicle-owners/${id}`, formData);
export const deleteVehicleOwner = (id) => api.delete(`/vehicle-owners/${id}`);
// Admin only vehicle APIs
export const createVehicle = (formData) => {return api.post('/vehicles', formData, {headers: {'Content-Type': 'multipart/form-data'}});};
export const updateVehicle = (id, formData) => {
  formData.append('_method', 'PUT'); // Tell Laravel to treat this as PUT
  return api.post(`/vehicles/${id}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
};
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
// Admin only User APIs
export const getUsers = () => api.get('/users');
export const registerAdmin = (adminData) => {return api.post('/admin/users', adminData, {headers: {'Content-Type': 'multipart/form-data'}});};
export const updateAdmin = (id, userData) => {
  return api.put(`/admin/users/${id}`, userData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
};
export const deleteAdmin = (id) => api.delete(`/admin/users/${id}`);
// Admin only Request APIs
export const getAdminRoleRequests = () => api.get('/admin/role-requests');
export const approveRoleRequest = (id) => api.patch(`/admin/role-requests/${id}/approve`);
export const rejectRoleRequest = (id) => api.patch(`/admin/role-requests/${id}/reject`);
export const getRoleRequestStatistics = () => api.get('/admin/role-requests/statistics');

export default api;