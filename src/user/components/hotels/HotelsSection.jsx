import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import HotelCard from './HotelCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const HotelsSection = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const hotelsPerPage = 8;
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
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/hotels`);
        const hotelsWithReviews = response.data.map(hotel => ({
          ...hotel,
          averageRating: hotel.reviews_avg_rating || 0,
          reviewCount: hotel.reviews_count || 0
        }));
        setHotels(hotelsWithReviews);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    const filtered = hotels.filter((hotel) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (hotel.hotel_name || hotel.hotelName)?.toLowerCase().includes(searchLower);
      const hasLocation = hotel.locations && Array.isArray(hotel.locations) && 
                         hotel.locations.some(loc => loc === selectedLocation);
      const matchesLocation = selectedLocation === 'All Locations' || hasLocation;
      return matchesSearch && matchesLocation;
    });
    return filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  }, [searchTerm, selectedLocation, hotels]);

  const hasHotelsForSelectedLocation = useMemo(() => {
    if (selectedLocation === 'All Locations') return true;
    return hotels.some(hotel => 
      hotel.locations && Array.isArray(hotel.locations) && 
      hotel.locations.includes(selectedLocation)
    );
  }, [selectedLocation, hotels]);

  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);
  const startIndex = (currentPage - 1) * hotelsPerPage;
  const currentHotels = filteredHotels.slice(startIndex, startIndex + hotelsPerPage);

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
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 translate-x-1/2" />
      
      {/* Global Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] -z-10"
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Immersive Hero Header */}
      <div className="relative h-[55vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Luxury Nature Stay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl pt-32 pb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Stay in Nature
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Serene <span className="text-emerald-500">Sanctuaries</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            From luxury eco-resorts to cozy mountain cabins, find the perfect base for your island exploration.
          </motion.p>
        </div>
      </div>

      <main className="max-w-full px-6 lg:px-12 mx-auto relative -mt-12 z-20 pb-32">
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 mb-12">
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
              {/* No Hotels for Selected Location */}
              {selectedLocation !== 'All Locations' && !hasHotelsForSelectedLocation && (
                <div className="text-center py-24 bg-emerald-50/50 rounded-[2.5rem] border-2 border-dashed border-emerald-200 mb-12">
                  <div className="inline-flex items-center justify-center size-24 bg-emerald-100 rounded-full mb-6">
                    <span className="text-4xl">🏨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No sanctuaries available in {selectedLocation}</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try another paradise nearby or browse our full collection of stays.
                  </p>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentHotels.map((hotel, index) => (
                  <motion.div
                    key={hotel.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <HotelCard
                      hotel={hotel}
                      rating={hotel.averageRating || 0}
                      onClick={() => navigate(`/hotels/${hotel.id}`)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* No Results from Search */}
              {filteredHotels.length === 0 && hasHotelsForSelectedLocation && (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center size-24 bg-gray-100 rounded-full mb-6">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No stays found</h3>
                  <p className="text-gray-500">Try broading your search or selecting a different location.</p>
                </div>
              )}

              {/* Pagination */}
              {filteredHotels.length > hotelsPerPage && (
                <div className="flex justify-center items-center space-x-4 mt-20 pb-20">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="group flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold transition-all hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30"
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
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-white border-2 border-gray-100 hover:border-emerald-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="group flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 disabled:opacity-30"
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

export default HotelsSection;