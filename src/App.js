import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import ManageLocations from './Pages/ManageLocations/ManageLocations';
import AddNewLocation from './Pages/AddNewLocation/AddNewLocation';
import ViewLocation from './Pages/ViewLocation/ViewLocation';
import ManageGuides from './Pages/ManageGuides/ManageGuides';
import ViewGuide from './Pages/ViewGuide/ViewGuide';
import ManageShops from './Pages/ManageShops/ManageShops';
import ViewShop from './Pages/ViewShop/ViewShop';
import ManageRequests from './Pages/ManageRequests/ManageRequests.js';
import ManageReviews from './Pages/ManageReviews/ManageReviews.js';
import ForgotPassword from './Components/LoginRegistration/ForgotPassword';


import HomePage from './Pages/HomePage/HomePage';
import Login from './Components/LoginRegistration/Login';
import Register from './Components/LoginRegistration/Register';
import UserProfile from './Pages/UserProfile/UserProfile';
import GuideProfile from './Pages/GuideProfile/GuideProfile';
import ShopOwnerProfile from './Pages/ShopOwnerProfile/ShopOwnerProfile';
import LocationsPage from './Pages/LocationsPage/LocationsPage';
import LocationView from './Pages/LocationView/LocationView';
import LocationReviewForm from './Pages/LocationReviewPage/LocationReviewForm.js';
import GuidesPage from './Pages/GuidesPage/GuidesPage';
import GuideView from './Pages/GuideView/GuideView.js';
import ItemsPage from './Pages/ItemsPage/ItemsPage.js';
import ItemView from './Pages/ItemView/ItemView.js';
import ItemShopView from './Pages/ItemShopView/ItemShopView';
import SiteReviewPage from './Pages/SiteReviewPage/SiteReviewPage';
import ReviewForm from './Pages/ReviewFormPage/ReviewForm';
import AllReview from './Pages/AllReviewPage/AllReview';
import EditReview from './Pages/AllReviewPage/EditReview';
import Navbar from './Components/Navbar/Navbar';
import ItemReviewForm from './Pages/ItemReviewPage/ItemReviewForm.js';
// import GuideForm from './Pages/GuideReg/GuideForm';
import CreateShop from './Components/CreateShop/CreateShop.js';
import ShopProfile from './Components/ShopProfile/ShopProfile.js';
import ItemForm from './Components/ItemForm/ItemForm.js';
import EditItemForm from './Pages/EditItemForm/EditItemForm.js';
import GuideReviewForm from './Pages/GuideReviewPage/GuideReviewForm.js';
import UserGuideReview from './Pages/UserReviewpages/UserGuideReview/UserGuideReview.js';
import UserItemReview from './Pages/UserReviewpages/UserItemReview/UserItemReview.js';
import UserPlaceReview from './Pages/UserReviewpages/UserPlaceReview/UserPlaceReview.js';
import UserSiteReview from './Pages/UserReviewpages/UserSiteReview/UserSiteReview.js';

const AppRoutes = ({ user, setUser, logout }) => {
  const location = useLocation();

  const adminRoutes = [
    '/adminPanel',
    '/manageLocations',
    '/manageLocations/addNew',
    '/viewLocation',
    '/manageGuides',
    '/viewGuide',
    '/manageShops',
    '/viewShop',
    '/manageRequests',
    '/manageReviews'
  ];

  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));

  const getRedirectProfile = () => {
    if (!user) return <Navigate to="/login" />;
    switch (user.role) {
      case 'GUIDE':
        return <GuideProfile user={user} />;
      case 'SHOP_OWNER':
        return <ShopOwnerProfile user={user} />;
      default:
        return <UserProfile user={user} />;
    }
  };

  return (
    <>
      {!isAdminRoute && <Navbar user={user} logout={logout}/>}
      <Routes>
        {/* Admin Routes */}
        <Route path="/adminPanel" element={<AdminDashboard />} />
        <Route path="/manageLocations" element={<ManageLocations />} />
        <Route path="/manageLocations/addNew" element={<AddNewLocation />} />
        <Route path="/viewLocation/:id" element={<ViewLocation />} />
        <Route path="/manageGuides" element={<ManageGuides />} />
        <Route path="/viewGuide/:id" element={<ViewGuide />} />
        <Route path="/manageShops" element={<ManageShops />} />
        <Route path="/viewShop/:id" element={<ViewShop />} />
        <Route path="/manageRequests" element={<ManageRequests />} />
        <Route path="/manageReviews" element={<ManageReviews />} />

        {/* Website (User Side) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={getRedirectProfile()} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locationView/:id" element={<LocationView />} />
        <Route path="/locationReview/:id" element={<LocationReviewForm />} />
        <Route path="/itemReview/:id" element={<ItemReviewForm />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/guideView/:id" element={<GuideView />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/itemView/:id" element={<ItemView />} />
        <Route path="/itemShopView/:id" element={<ItemShopView />} />
        <Route path="/reviews" element={<SiteReviewPage />} />
        <Route path="/addReview" element={<ReviewForm />} />
        <Route path='/userGuideReview/:id' element={<UserGuideReview/>}/>
        <Route path='/userItemReview' element={<UserItemReview/>}/>
        <Route path='/userLocationReview/:id' element={<UserPlaceReview/>}/>
        <Route path='/userSiteReview/:id' element={<UserSiteReview/>}/>
        <Route path="/allReviews" element={<AllReview />} />
        {/* <Route path="/GuideReg" element={<GuideForm />} /> */}
        <Route path="/createShop/:id" element={<CreateShop/>}/>
        <Route path="/shopProfile/:id" element={<ShopProfile/>}/>
        <Route path="/itemForm/:id" element={<ItemForm/>}/>
        <Route path="/editItemForm/:id" element={<EditItemForm/>}/>
        <Route path="/guideReviewForm/:id" element={<GuideReviewForm/>}/>
        <Route path="/edit/:id" element={<EditReview />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} logout={logout} />
    </Router>
  );
};

export default App;

return
