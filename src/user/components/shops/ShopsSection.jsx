import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import ShopCard from './ShopCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const ShopsSection = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const shopsPerPage = 9;
  const navigate = useNavigate();

  // Base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch all locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const response = await axios.get(`${API_URL}/api/locations`);
        const locationNames = response.data.map(location => location.locationName);
        setAllLocations(['All Locations', ...locationNames.sort()]);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  // Fetch shops from API with reviews
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/shops`);

        const shopsWithReviews = response.data.map(shop => ({
          ...shop,
          // Ratings are now included in the response
          averageRating: shop.reviews_avg_rating || 0,
          reviewCount: shop.reviews_count || 0
        }));

        setShops(shopsWithReviews);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Filtering and sorting
  const filteredShops = useMemo(() => {
    // First filter the shops
    const filtered = shops.filter((shop) => {
      const searchLower = searchTerm.toLowerCase();
      // Updated to use the correct database key: shop_name
      const matchesSearch = 
        (shop.shop_name || shop.shopName || '')?.toLowerCase().includes(searchLower);
      
      // Check if the shop has the selected location in their locations array
      const hasLocation = shop.locations && Array.isArray(shop.locations) && 
                         shop.locations.some(loc => loc === selectedLocation);
      
      const matchesLocation = selectedLocation === 'All Locations' || hasLocation;
      
      return matchesSearch && matchesLocation;
    });

    // Then sort by rating (descending) and then by name (ascending)
    return filtered.sort((a, b) => {
      const ratingA = a.averageRating || 0;
      const ratingB = b.averageRating || 0;
      
      // First sort by rating (higher ratings first)
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      
      // If ratings are the same, sort alphabetically by name
      const nameA = (a.shop_name || a.shopName || '')?.toLowerCase();
      const nameB = (b.shop_name || b.shopName || '')?.toLowerCase();
      
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, [searchTerm, selectedLocation, shops]);

  // Check if selected location has any shops
  const hasShopsForSelectedLocation = useMemo(() => {
    if (selectedLocation === 'All Locations') return true;
    
    return shops.some(shop => 
      shop.locations && Array.isArray(shop.locations) && 
      shop.locations.includes(selectedLocation)
    );
  }, [selectedLocation, shops]);

  // Pagination
  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);
  const startIndex = (currentPage - 1) * shopsPerPage;
  const currentShops = filteredShops.slice(startIndex, startIndex + shopsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation]);

  const handleShopClick = (shop) => {
    navigate(`/shops/${shop.id}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 pt-16 ${styles.initialPage}`}>
      <Navbar onScrollToSection={scrollToSection} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Camping Gear Shops
          </h2>
          <p className="text-gray-600">
            Find everything you need for your outdoor adventure
          </p>
        </div>

        {/* Search & Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          showLocationFilter={true}
          locations={allLocations}
          placeholder="Search shops..."
          isLocationPage={false}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏬🏪</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Loading shops...</h3>
            <p className="text-gray-600">Please wait while we organize the best shops for you</p>
          </div>
        )}

        {/* No Guides for Selected Location Message */}
        {!isLoading && selectedLocation !== 'All Locations' && !hasShopsForSelectedLocation && (
          <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops nearby for {selectedLocation}</h3>
            <p className="text-gray-600">
              We don't have any shops nearby for this location yet. 
              Try selecting a different location or browse all shops.
            </p>
          </div>
        )}

        {/* Shops Grid */}
        {!isLoading && filteredShops.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${styles.entitiesGrid}`}>
              {currentShops.map((shop, index) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  rating={shop.averageRating || 0}
                  onClick={() => handleShopClick(shop)}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>

            {/* Pagination */}
            {filteredShops.length > shopsPerPage && (
              <div className={`flex justify-center items-center space-x-4 mt-12 ${styles.animateSlideInUp}`}>
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Load More */}
                <button
                  onClick={handleLoadMore}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results from Search */}
        {!isLoading && filteredShops.length === 0 && hasShopsForSelectedLocation && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopsSection;