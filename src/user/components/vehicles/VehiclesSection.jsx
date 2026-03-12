import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import VehicleCard from './VehicleCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const VehiclesSection = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const vehiclesPerPage = 9;
  const navigate = useNavigate();

  // Fetch all locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const response = await axios.get('http://localhost:8000/api/locations');
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

  // Fetch vehicles from API with reviews
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/vehicles');

        const vehiclesWithReviews = response.data.map(vehicle => ({
          ...vehicle,
          // Ratings are now included in the response
          averageRating: vehicle.reviews_avg_rating || 0,
          reviewCount: vehicle.reviews_count || 0
        }));

        setVehicles(vehiclesWithReviews);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Filtering and sorting
  const filteredVehicles = useMemo(() => {
    // First filter the vehicles
    const filtered = vehicles.filter((vehicle) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        vehicle.vehicleName?.toLowerCase().includes(searchLower);
      
      // Check if the vehicle has the selected location in their locations array
      const hasLocation = vehicle.locations && Array.isArray(vehicle.locations) && 
                         vehicle.locations.some(loc => loc === selectedLocation);
      
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
      const nameA = a.vehicleName?.toLowerCase() || '';
      const nameB = b.vehicleName?.toLowerCase() || '';
      
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, [searchTerm, selectedLocation, vehicles]);

  // Check if selected location has any vehicles
  const hasVehiclesForSelectedLocation = useMemo(() => {
    if (selectedLocation === 'All Locations') return true;
    
    return vehicles.some(vehicle => 
      vehicle.locations && Array.isArray(vehicle.locations) && 
      vehicle.locations.includes(selectedLocation)
    );
  }, [selectedLocation, vehicles]);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, startIndex + vehiclesPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation]);

  const handleVehicleClick = (vehicle) => {
    navigate(`/vehicles/${vehicle.id}`);
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
            Adventure Vehicles
          </h2>
          <p className="text-gray-600">
            Rent the perfect vehicle for your outdoor journey
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
          placeholder="Search hotels..."
          isLocationPage={false}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗🚐🛵🛺</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Loading vehicles...</h3>
            <p className="text-gray-600">Please wait while we organize the best vehicles for you</p>
          </div>
        )}

        {/* No Hotels for Selected Location Message */}
        {!isLoading && selectedLocation !== 'All Locations' && !hasVehiclesForSelectedLocation && (
          <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles available for {selectedLocation}</h3>
            <p className="text-gray-600">
              We don't have any vehicles available to this location yet. 
              Try selecting a different location or browse all vehicles.
            </p>
          </div>
        )}

        {/* Hotels Grid */}
        {!isLoading && filteredVehicles.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${styles.entitiesGrid}`}>
              {currentVehicles.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  rating={vehicle.averageRating || 0}
                  onClick={() => handleVehicleClick(vehicle)}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>

            {/* Pagination */}
            {filteredVehicles.length > vehiclesPerPage && (
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
        {!isLoading && filteredVehicles.length === 0 && hasVehiclesForSelectedLocation && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default VehiclesSection;