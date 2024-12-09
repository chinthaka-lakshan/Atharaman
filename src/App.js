import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminPanel from './Pages/AdminPanel/AdminPanel';
import ManageLocations from './Pages/ManageLocations/ManageLocations';
import AddNewLocation from './Pages/AddNewLocation/AddNewLocation';
import HomePage from './Pages/HomePage/HomePage';
import LocationsPage from './Pages/LocationsPage/LocationsPage';
import GuidesPage from './Pages/GuidesPage/GuidesPage';
import ShopsPage from './Pages/ShopsPage/ShopsPage';
import ViewLocation from './Pages/ViewLocation/ViewLocation';
import PlaceView from './Pages/PlaceView/PlaceView';
import ManageGuides from './Pages/ManageGuides/ManageGuides';
import AddNewGuides from './Pages/AddNewGuide/AddNewGuide';
import AddReview from './Pages/AddReviewpage/AddReview';
import SiteReviewPage from './Pages/SiteReviewPage/SiteReviewPage';
import ReviewForm from './Pages/SiteReviewPage/ReviewForm';


// Create router with dynamic path for SingleLocationPage
const router = createBrowserRouter([
  {
    path: "/adminPanel",
    element: <AdminPanel />,
  },
  {
    path: "/viewLocation/:id",
    element: <ViewLocation />,
  },
  {
    path: "/manageLocations",
    element: <ManageLocations/>,
  },
  {
    path: "/manageGuides",
    element: <ManageGuides/>,
  },
  {
    path: "/manageLocations/addNew",
    element: <AddNewLocation/>,
  },
  {
    path: "/manageGuides/addNew",
    element: <AddNewGuides/>,
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
    path: "/guides",
    element: <GuidesPage />,
  },
  {
    path: "/shops",
    element: <ShopsPage />,
  },
  {
    path: "/placeView",
    element: <PlaceView />,
  },
  {
    path: "/SiteReviewPage",
    element: <SiteReviewPage />,
  },
  {
    path:"/addReview",
    element:<AddReview/>,
  },
  {
    path:"/reviewForm",
    element:<ReviewForm/>,
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