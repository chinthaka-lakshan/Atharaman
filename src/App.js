import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import ManageLocations from './Pages/ManageLocations/ManageLocations';
import AddNewLocation from './Pages/AddNewLocation/AddNewLocation';
import ViewLocation from './Pages/ViewLocation/ViewLocation';
import HomePage from './Pages/HomePage/HomePage';
import LocationsPage from './Pages/LocationsPage/LocationsPage';
import LocationView from './Pages/LocationView/LocationView';
import GuideForm from './Pages/GuideReg/GuideForm';
import GuidesPage from './Pages/GuidesPage/GuidesPage';
import ShopsPage from './Pages/ShopsPage/ShopsPage';
import ManageGuides from './Pages/ManageGuides/ManageGuides';
import AddNewGuide from './Pages/AddNewGuide/AddNewGuide';
import ViewGuide from './Pages/ViewGuide/ViewGuide';
import ManageShops from './Pages/ManageShops/ManageShops';
import AddNewShop from './Pages/AddNewShop/AddNewShop';
import ViewShop from './Pages/ViewShop/ViewShop';
import AddReview from './Pages/AddReviewpage/AddReview';
import SiteReviewPage from './Pages/SiteReviewPage/SiteReviewPage';
import Login from './Components/LoginRegistration/Login';
import Register from './Components/LoginRegistration/Register';

const router = createBrowserRouter([
  {
    path: "/adminPanel",
    element: <AdminDashboard/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/manageLocations",
    element: <ManageLocations/>,
  },
  {
    path: "/manageLocations/addNew",
    element: <AddNewLocation/>,
  },
  {
    path: "/viewLocation/:id",
    element: <ViewLocation/>,
  },
  {
    path: "/manageGuides",
    element: <ManageGuides/>,
  },
  {
    path: "/manageGuides/addNew",
    element: <AddNewGuide/>,
  },
  {
    path: "/viewGuide/:id",
    element: <ViewGuide/>,
  },
  {
    path: "/manageShops",
    element: <ManageShops/>,
  },
  {
    path: "/manageShops/addNew",
    element: <AddNewShop/>,
  },
  {
    path: "/viewShop/:id",
    element: <ViewShop/>,
  },
  
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/locations",
    element: <LocationsPage />,
  },
  {
    path: "/locationView/:id",
    element: <LocationView/>,
  },
  {
    path: "/guides",
    element: <GuidesPage />,
  },
  {
    path: "/shops",
    element: <ShopsPage />,
  },
  {
    path: "/SiteReviewPage",
    element: <SiteReviewPage />,
  },
  {
    path:"/addReview",
    element:<AddReview/>,
  },

]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;