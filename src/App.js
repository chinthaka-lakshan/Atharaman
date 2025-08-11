import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LocationsPage from './pages/LocationsPage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import GuideDetailsPage from './pages/GuideDetailsPage';
import ShopDetailsPage from './pages/ShopDetailsPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Forest Green
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6F00', // Adventure Orange
      light: '#FF8F00',
      dark: '#E65100',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D6D7E',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LocationsPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/location/:id" element={<LocationDetailsPage />} />
          <Route path="/guide/:id" element={<GuideDetailsPage />} />
          <Route path="/shop/:id" element={<ShopDetailsPage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
          <Route path="/hotel/:id" element={<HotelDetailsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;