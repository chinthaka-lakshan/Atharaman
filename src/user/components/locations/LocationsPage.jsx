import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import LocationCard from './LocationCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const locationsPerPage = 8; // Changed to 8 for neat 2x4 grid
  const navigate = useNavigate();

  // Unified category system
  const categoryFilters = [
    { value: 'all', label: 'All' },
    { value: 'mountain', label: 'Mountains', keywords: ['mountain'] },
    { value: 'beach', label: 'Beaches', keywords: ['beach'] },
    { value: 'forest', label: 'Forests', keywords: ['forest'] },
    { value: 'temple', label: 'Temples', keywords: ['temple'] },
    { value: 'village', label: 'Villages', keywords: ['village'] },
    { value: 'waterfall', label: 'Waterfalls', keywords: ['waterfall'] },
    { value: 'historic', label: 'Historic', keywords: ['historic', 'building'] }
  ];

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/locations');
        const locationsWithCategory = response.data.map(location => ({
          ...location,
          averageRating: location.reviews_avg_rating || 0,
          reviewCount: location.reviews_count || 0,
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

  const filteredLocations = useMemo(() => {
    const filtered = locations.filter((location) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        location.locationName?.toLowerCase().includes(searchLower) ||
        location.locationType?.toLowerCase().includes(searchLower);
      const matchesFilter = selectedFilter === 'all' || 
        location.locationType?.toLowerCase().includes(selectedFilter.toLowerCase());
      return matchesSearch && matchesFilter;
    });
    return filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  }, [searchTerm, selectedFilter, locations]);

  const totalPages = Math.ceil(filteredLocations.length / locationsPerPage);
  const startIndex = (currentPage - 1) * locationsPerPage;
  const currentLocations = filteredLocations.slice(startIndex, startIndex + locationsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

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
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />
      
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
            src="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Nature Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl pt-32 pb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Explore Sri Lanka
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Discover Your Next <span className="text-orange-500">Adventure</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Our curated list of breathtaking locations awaits you. From misty mountains to golden shores.
          </motion.p>
        </div>
      </div>

      <main className="max-w-full px-6 lg:px-12 mx-auto relative -mt-12 z-20 pb-32">
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 mb-12">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedLocation={selectedFilter}
            onLocationChange={setSelectedFilter}
            filterOptions={categoryFilters}
            placeholder='Search locations...'
            isLocationPage={true}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentLocations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <LocationCard
                      location={location}
                      rating={location.averageRating || 0}
                      onClick={() => navigate(`/locations/${location.id}`)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* No Results */}
              {currentLocations.length === 0 && (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center size-24 bg-gray-100 rounded-full mb-6">
                    <span className="text-4xl">🏔️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No locations found</h3>
                  <p className="text-gray-500">Try broading your search or selecting a different category.</p>
                </div>
              )}

              {/* Pagination */}
              {filteredLocations.length > locationsPerPage && (
                <div className="flex justify-center items-center space-x-4 mt-20 pb-20">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="group flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold transition-all hover:border-orange-500 hover:text-orange-500 disabled:opacity-30"
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
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-white border-2 border-gray-100 hover:border-orange-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="group flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 disabled:opacity-30"
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

export default LocationsPage;