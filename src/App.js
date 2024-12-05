import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './Pages/HomePage/HomePage'
import LocationsPage from './Pages/LocationsPage/LocationsPage'
import GuidesPage from './Pages/GuidesPage/GuidesPage'
import ShopsPage from './Pages/ShopsPage/ShopsPage'
import LoginPage from './Pages/LoginPage/LoginPage'
import AddReview from './Pages/AddReviewpage/AddReview'
import SiteReviewPage from './Pages/SiteReviewPage/SiteReviewPage'
import AllReview from './Pages/AllReviewPage/AllReview'



const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/AllReview",
    element: <AllReview/>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/locations",
    element: <LocationsPage/>,
  },
  {
    path: "/guides",
    element: <GuidesPage/>,
  },
  {
    path: "/shops",
    element: <ShopsPage/>,
  },
  {
    path:"/SiteReviewPage",
    element:<SiteReviewPage/>
  },
  {
    path: "/addReview",
    element: <AddReview/>,
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
