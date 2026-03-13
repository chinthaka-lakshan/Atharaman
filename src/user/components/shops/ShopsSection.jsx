import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import ShopCard from './ShopCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const ShopsSection = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const shopsPerPage = 8;
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
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/shops`);
        const shopsWithReviews = response.data.map(shop => ({
          ...shop,
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

  const filteredShops = useMemo(() => {
    const filtered = shops.filter((shop) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (shop.shop_name || shop.shopName || '')?.toLowerCase().includes(searchLower);
      const hasLocation = shop.locations && Array.isArray(shop.locations) && 
                         shop.locations.some(loc => loc === selectedLocation);
      const matchesLocation = selectedLocation === 'All Locations' || hasLocation;
      return matchesSearch && matchesLocation;
    });
    return filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  }, [searchTerm, selectedLocation, shops]);

  const hasShopsForSelectedLocation = useMemo(() => {
    if (selectedLocation === 'All Locations') return true;
    return shops.some(shop => 
      shop.locations && Array.isArray(shop.locations) && 
      shop.locations.includes(selectedLocation)
    );
  }, [selectedLocation, shops]);

  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);
  const startIndex = (currentPage - 1) * shopsPerPage;
  const currentShops = filteredShops.slice(startIndex, startIndex + shopsPerPage);

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
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

      {/* Immersive Hero Header */}
      <div className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Artisanal Marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Support Local
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Artisanal <span className="text-orange-500">Marketplace</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Discover unique handicrafts, authentic camping gear, and local treasures from every corner of the island.
          </motion.p>
        </div>
      </div>

      <main className="max-w-full px-6 lg:px-12 mx-auto relative -mt-16 z-20">
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 mb-12">
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
        </div>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="flex justify-center space-x-2 mb-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-4 h-4 bg-orange-500 rounded-full"
                  />
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Opening the doors...</h3>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* No Shops for Selected Location */}
              {selectedLocation !== 'All Locations' && !hasShopsForSelectedLocation && (
                <div className="text-center py-24 bg-rose-50/50 rounded-[2.5rem] border-2 border-dashed border-rose-200 mb-12">
                  <div className="inline-flex items-center justify-center size-24 bg-rose-100 rounded-full mb-6">
                    <span className="text-4xl">🏪</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No shops nearby for {selectedLocation}</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Check back soon! We're adding more artisanal partners every day.
                  </p>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentShops.map((shop, index) => (
                  <motion.div
                    key={shop.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <ShopCard
                      shop={shop}
                      rating={shop.averageRating || 0}
                      onClick={() => navigate(`/shops/${shop.id}`)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* No Results from Search */}
              {filteredShops.length === 0 && hasShopsForSelectedLocation && (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center size-24 bg-gray-100 rounded-full mb-6">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No shops found</h3>
                  <p className="text-gray-500">Try broading your search or selecting a different location.</p>
                </div>
              )}

              {/* Pagination */}
              {filteredShops.length > shopsPerPage && (
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

export default ShopsSection;