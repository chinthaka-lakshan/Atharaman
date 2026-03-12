import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './services/ProtectedRoute';
// Admin Components
import Navbar from './admin/components/Navbar';
import Sidebar from './admin/components/Sidebar';
// Admin Pages
import Dashboard from './admin/pages/Dashboard';
import ManageLocations from './admin/pages/ManageLocations';
import ManageGuides from './admin/pages/ManageGuides';
import ManageShopOwners from './admin/pages/ManageShopOwners';
import ManageHotelOwners from './admin/pages/ManageHotelOwners';
import ManageVehicleOwners from './admin/pages/ManageVehicleOwners';
import ManageRequests from './admin/pages/ManageRequests';
import ManageReviews from './admin/pages/ManageReviews';
import ManageUsers from './admin/pages/ManageUsers';
// User Components
import {LocationsPage} from './user/components/locations/LocationsPage';
import {GuidesSection} from './user/components/guides/GuidesSection';
import {HotelsSection} from './user/components/hotels/HotelsSection';
import {ShopsSection} from './user/components/shops/ShopsSection';
import {VehiclesSection} from './user/components/vehicles/VehiclesSection';
// User Pages
import Home from './user/pages/Home';
import UserProfilePage from './user/pages/UserProfilePage';
import PrivacyPolicy from './user/pages/PrivacyPolicy';
import Settings from './user/pages/Settings';
import TermsAndConditions from './user/pages/TermsAndConditions';
import ForgotPassword from './user/pages/ForgotPassword';
import ResetPassword from './user/pages/ResetPassword';
import Unauthorized from './user/pages/Unauthorized';
import LocationDetailPage from './user/pages/LocationDetailPage';
import GuideDetailPage from './user/pages/GuideDetailPage';
import ShopDetailPage from './user/pages/ShopDetailPage';
import HotelDetailPage from './user/pages/HotelDetailPage';
import VehicleDetailPage from './user/pages/VehicleDetailPage';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {isAdminRoute ? (
          // Admin Layout - All admin routes are protected
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 ml-64 p-6">
                <Routes location={location} key={location.pathname}>
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/locations" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <ManageLocations />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/guides" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <ManageGuides />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/shopowners" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <ManageShopOwners />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/hotelowners" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <ManageHotelOwners />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/vehicleowners" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <ManageVehicleOwners />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/requests" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <ManageRequests />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/reviews" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <ManageReviews />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <ManageUsers />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          // User Layout
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/locations/:id" element={<LocationDetailPage />} />
            <Route path="/guides" element={<GuidesSection />} />
            <Route path="/guides/:id" element={<GuideDetailPage />} />
            <Route path="/shops" element={<ShopsSection />} />
            <Route path="/shops/:id" element={<ShopDetailPage />} />
            <Route path="/hotels" element={<HotelsSection />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />
            <Route path="/vehicles" element={<VehiclesSection />} />
            <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}