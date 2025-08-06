import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TopSection from '../components/TopSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import { topLocations, topGuides, topShops, topHotels, topVehicles } from '../data/mockData';

const HomePage = () => {
  const handleCardClick = (item, type) => {
    console.log(`Clicked ${type}:`, item);
    // Handle navigation to detail page
  };

  const handleSeeMore = (type) => {
    console.log(`See more ${type}`);
    // Handle navigation to listing page
  };

  return (
    <Box>
      <Navbar />
      <HeroSection />
      
      <Box id="locations">
        <TopSection
          title="Top Locations"
          data={topLocations}
          type="location"
          onCardClick={(item) => handleCardClick(item, 'location')}
          onSeeMore={() => handleSeeMore('locations')}
        />
      </Box>

      <Box id="guides" sx={{ bgcolor: 'grey.50' }}>
        <TopSection
          title="Top Guides"
          data={topGuides}
          type="guide"
          onCardClick={(item) => handleCardClick(item, 'guide')}
          onSeeMore={() => handleSeeMore('guides')}
        />
      </Box>

      <Box id="shops">
        <TopSection
          title="Top Shops"
          data={topShops}
          type="shop"
          onCardClick={(item) => handleCardClick(item, 'shop')}
          onSeeMore={() => handleSeeMore('shops')}
        />
      </Box>

      <Box id="hotels" sx={{ bgcolor: 'grey.50' }}>
        <TopSection
          title="Top Hotels"
          data={topHotels}
          type="hotel"
          onCardClick={(item) => handleCardClick(item, 'hotel')}
          onSeeMore={() => handleSeeMore('hotels')}
        />
      </Box>

      <Box id="vehicles">
        <TopSection
          title="Top Vehicles"
          data={topVehicles}
          type="vehicle"
          onCardClick={(item) => handleCardClick(item, 'vehicle')}
          onSeeMore={() => handleSeeMore('vehicles')}
        />
      </Box>

      <AboutSection />
      <Footer />
    </Box>
  );
};

export default HomePage;