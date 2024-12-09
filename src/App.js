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
import LocationView from './Pages/LocationView/LocationView';
import ManageGuides from './Pages/ManageGuides/ManageGuides';
import AddNewGuides from './Pages/AddNewGuide/AddNewGuide';

const router = createBrowserRouter([
  {
    path: "/adminPanel",
    element: <AdminPanel/>,
  },
  {
    path: "/viewGuide/:id",
    element: <ViewGuide />,
  },
  {
    path: "/manageLocations",
    element: <ManageLocations/>,
  },
  {
    path: "/admin/manageLocations/addNew",
    element: <AddNewLocation/>,
  },
  {
    path: "/admin/viewLocation/:id",
    element: <ViewLocation/>,
  },
  {
    path: "/manageGuides",
    element: <ManageGuides/>,
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
    path: "/locationView/:1",
    element: <LocationView />,
  },
  {
    path: "/GuideReg",
    element: <GuideForm/>,
  },

  {
    path: "/ProfilePage",
    element: <ProfilePage/>,
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