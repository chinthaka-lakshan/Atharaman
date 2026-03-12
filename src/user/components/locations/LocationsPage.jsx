import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import LocationCard from './LocationCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const locationsPerPage = 9;
  const navigate = useNavigate();

  // Unified category system - define categories in one place
  const categoryFilters = [
    { value: 'all', label: 'All Locations' },
    { value: 'mountain', label: 'Mountains', keywords: ['mountain'] },
    { value: 'rock', label: 'Rocks', keywords: ['rock'] },
    { value: 'plain', label: 'Plains', keywords: ['plain'] },
    { value: 'valley', label: 'Valleys', keywords: ['valley'] },
    { value: 'beach', label: 'Beaches', keywords: ['beach'] },
    { value: 'cliff', label: 'Cliffs', keywords: ['cliff'] },
    { value: 'desert', label: 'Deserts', keywords: ['desert'] },
    { value: 'forest', label: 'Forests', keywords: ['forest'] },
    { value: 'temple', label: 'Temples', keywords: ['temple'] },
    { value: 'building', label: 'Historic Buildings', keywords: ['building'] },
    { value: 'lake', label: 'Lakes', keywords: ['lake'] },
    { value: 'river', label: 'Rivers', keywords: ['river'] },
    { value: 'island', label: 'Islands', keywords: ['island'] },
    { value: 'road', label: 'Roads', keywords: ['road'] },
    { value: 'village', label: 'Villages', keywords: ['village'] },
    { value: 'other', label: 'Other', keywords: [] }
  ];

  // Function to determine category using the unified system
  const getCategory = (location) => {
    const type = location.locationType?.toLowerCase() || '';
    const name = location.locationName?.toLowerCase() || '';
    
    // Find the first category that matches keywords
    for (const category of categoryFilters) {
      if (category.value === 'all' || category.value === 'other') continue;
      
      if (category.keywords.some(keyword => 
        type.includes(keyword) || name.includes(keyword)
      )) {
        return category.value;
      }
    }
    
    return 'other';
  };

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/locations');
        // Add category to each location using our unified system
        const locationsWithCategory = response.data.map(location => ({
          ...location,
          category: getCategory(location),
          // Ratings are now included in the response
          averageRating: location.reviews_avg_rating || 0,
          reviewCount: location.reviews_count || 0,
          // Include images in the response
          locationImage: location.images ? location.images.map(img => img.image_path) : (location.locationImage || [])
        }));
        
        setLocations(locationsWithCategory);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filtering and sorting
  const filteredLocations = useMemo(() => {
    // First filter the locations
    const filtered = locations.filter((location) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        location.locationName?.toLowerCase().includes(searchLower) ||
        location.locationType?.toLowerCase().includes(searchLower);
      
      const matchesFilter =
        selectedFilter === 'all' || location.category === selectedFilter;
      
      return matchesSearch && matchesFilter;
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
      const nameA = a.locationName?.toLowerCase() || '';
      const nameB = b.locationName?.toLowerCase() || '';
      
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, [searchTerm, selectedFilter, locations]);

  // Pagination
  const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);
  const startIndex = (currentPage - 1) * locationsPerPage;
  const currentLocations = filteredLocations.slice(startIndex, startIndex + locationsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  const handleLocationClick = (location) => {
    navigate(`/locations/${location.id}`);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Your Next Adventure
          </h2>
          <p className="text-gray-600">
            Explore our curated list of breathtaking locations around the world.
          </p>
        </div>

        {/* Search and Filters */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLocation={selectedFilter}
          onLocationChange={setSelectedFilter}
          filterOptions={categoryFilters}
          placeholder='Search locations...'
          isLocationPage={true}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏕️🌄🏝️🗻</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Loading locations...</h3>
            <p className="text-gray-600">Please wait while we organize the best destinations for you</p>
          </div>
        )}

        {/* Locations Grid */}
        {!isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${styles.entitiesGrid}`}>
              {currentLocations.map((location, index) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  rating={location.averageRating || 0}
                  onClick={() => handleLocationClick(location)}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>

            {/* No Results */}
            {currentLocations.length === 0 && (
              <div className={`text-center py-16 ${styles.animateFadeInUp}`}>
                <div className="text-6xl mb-4">🏔️</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No locations found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Pagination */}
            {filteredLocations.length > locationsPerPage && (
              <div className={`flex justify-center items-center space-x-4 mt-12 ${styles.animateSlideInUp}`}>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

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
      </main>
    </div>
  );
};

export default LocationsPage;