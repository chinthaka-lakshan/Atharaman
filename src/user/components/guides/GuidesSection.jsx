import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import GuideCard from './GuideCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GuidesSection = () => {
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const guidesPerPage = 9;
  const navigate = useNavigate();

  // Fetch all locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const response = await axios.get('http://localhost:8000/api/locations');
        const locationNames = response.data.map(location => location.locationName || location.name);
        setAllLocations(['All Locations', ...locationNames.sort()]);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  // Fetch guides from API
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/guides');

        const guidesWithReviews = response.data.map(guide => ({
          ...guide,
          // Use backend field names
          averageRating: guide.reviews_avg_rating || 0,
          reviewCount: guide.reviews_count || 0,
          // Images are already in the correct structure from backend
          images: guide.images || []
        }));

        setGuides(guidesWithReviews);
      } catch (error) {
        console.error('Error fetching guides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // Filtering and sorting
  const filteredGuides = useMemo(() => {
    // First filter the guides
    const filtered = guides.filter((guide) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        guide.guide_name?.toLowerCase().includes(searchLower) ||
        guide.short_description?.toLowerCase().includes(searchLower);
      
      // Check if the guide has the selected location in their locations array
      const hasLocation = guide.locations && Array.isArray(guide.locations) && 
                         guide.locations.some(loc => loc === selectedLocation);
      
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
      const nameA = a.guide_name?.toLowerCase() || '';
      const nameB = b.guide_name?.toLowerCase() || '';
      
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, [searchTerm, selectedLocation, guides]);

  // Check if selected location has any guides
  const hasGuidesForSelectedLocation = useMemo(() => {
    if (selectedLocation === 'All Locations') return true;
    
    return guides.some(guide => 
      guide.locations && Array.isArray(guide.locations) && 
      guide.locations.includes(selectedLocation)
    );
  }, [selectedLocation, guides]);

  // Pagination
  const totalPages = Math.ceil(filteredGuides.length / guidesPerPage);
  const startIndex = (currentPage - 1) * guidesPerPage;
  const currentGuides = filteredGuides.slice(startIndex, startIndex + guidesPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation]);

  const handleGuideClick = (guide) => {
    navigate(`/guides/${guide.id}`);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
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
            Professional Guides
          </h2>
          <p className="text-gray-600">
            Connect with experienced guides for your next adventure
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
          placeholder="Search guides..."
          isLocationPage={false}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧭👨‍🦯👩‍🦯🗺️</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Loading guides...</h3>
            <p className="text-gray-600">Please wait while we organize the best guides for you</p>
          </div>
        )}

        {/* No Guides for Selected Location Message */}
        {!isLoading && selectedLocation !== 'All Locations' && !hasGuidesForSelectedLocation && (
          <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
            <div className="text-6xl mb-4">🧭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides available for {selectedLocation}</h3>
            <p className="text-gray-600">
              We don't have any guides available to this location yet. 
              Try selecting a different location or browse all guides.
            </p>
          </div>
        )}

        {/* Guides Grid */}
        {!isLoading && filteredGuides.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${styles.entitiesGrid}`}>
              {currentGuides.map((guide, index) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  rating={guide.averageRating || 0}
                  reviewCount={guide.reviewCount || 0}
                  onClick={() => handleGuideClick(guide)}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>

            {/* Pagination */}
            {filteredGuides.length > guidesPerPage && (
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
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
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
        {!isLoading && filteredGuides.length === 0 && hasGuidesForSelectedLocation && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default GuidesSection;