import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import VehicleCard from './VehicleCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const VehiclesSection = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const vehiclesPerPage = 8;
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/vehicles`);
        const vehiclesWithReviews = response.data.map(vehicle => ({
          ...vehicle,
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

  const filteredVehicles = useMemo(() => {
    const filtered = vehicles.filter((vehicle) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (vehicle.vehicle_name || vehicle.vehicleName)?.toLowerCase().includes(searchLower);
      const hasLocation = vehicle.locations && Array.isArray(vehicle.locations) && 
                         vehicle.locations.some(loc => loc === selectedLocation);
      const matchesLocation = selectedLocation === 'All Locations' || hasLocation;
      return matchesSearch && matchesLocation;
    });
    return filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  }, [searchTerm, selectedLocation, vehicles]);

  const hasVehiclesForSelectedLocation = useMemo(() => {
    if (selectedLocation === 'All Locations') return true;
    return vehicles.some(vehicle => 
      vehicle.locations && Array.isArray(vehicle.locations) && 
      vehicle.locations.includes(selectedLocation)
    );
  }, [selectedLocation, vehicles]);

  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, startIndex + vehiclesPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

      {/* Immersive Hero Header */}
      <div className="relative h-[55vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1119487/pexels-photo-1119487.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Adventure Vehicles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl pt-32 pb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Roam Free
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Rugged <span className="text-cyan-500">Adventures</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            From sturdy 4x4s to nimble motorbikes, find the perfect companion for your island road trip.
          </motion.p>
        </div>
      </div>

      <main className="max-w-full px-6 lg:px-12 mx-auto relative -mt-12 z-20">
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 mb-12">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            showLocationFilter={true}
            locations={allLocations}
            placeholder="Search vehicles..."
            isLocationPage={false}
          />
        </div>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            null
          ) : (
            <motion.div 
              key="content"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* No Vehicles for Selected Location */}
              {selectedLocation !== 'All Locations' && !hasVehiclesForSelectedLocation && (
                <div className="text-center py-24 bg-cyan-50/50 rounded-[2.5rem] border-2 border-dashed border-cyan-200 mb-12">
                  <div className="inline-flex items-center justify-center size-24 bg-cyan-100 rounded-full mb-6">
                    <span className="text-4xl">🚗</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No vehicles stationed in {selectedLocation}</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try another depot nearby or explore our full fleet of adventure companions.
                  </p>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <VehicleCard
                      vehicle={vehicle}
                      rating={vehicle.averageRating || 0}
                      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* No Results from Search */}
              {filteredVehicles.length === 0 && hasVehiclesForSelectedLocation && (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center size-24 bg-gray-100 rounded-full mb-6">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                  <p className="text-gray-500">Try broading your search or selecting a different location.</p>
                </div>
              )}

              {/* Pagination */}
              {filteredVehicles.length > vehiclesPerPage && (
                <div className="flex justify-center items-center space-x-4 mt-20 pb-20">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="group flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold transition-all hover:border-cyan-500 hover:text-cyan-500 disabled:opacity-30"
                  >
                    <span>Previous</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          currentPage === page
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                            : 'bg-white border-2 border-gray-100 hover:border-cyan-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="group flex items-center space-x-2 px-6 py-3 bg-cyan-500 text-white rounded-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-600 disabled:opacity-30"
                  >
                    <span>Next</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default VehiclesSection;