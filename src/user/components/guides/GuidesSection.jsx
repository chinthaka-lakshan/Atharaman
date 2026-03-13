import React, { useState, useMemo, useEffect } from 'react';
import styles from '../../styles/InitialPages.module.css';
import SearchAndFilter from '../SearchAndFilter';
import GuideCard from './GuideCard';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const GuidesSection = () => {
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const guidesPerPage = 8;
  const navigate = useNavigate();

  // Fetch all locations
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

  // Fetch guides
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/guides');
        const guidesWithReviews = response.data.map(guide => ({
          ...guide,
          averageRating: guide.reviews_avg_rating || 0,
          reviewCount: guide.reviews_count || 0,
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

  // Filtering
  const filteredGuides = useMemo(() => {
    const filtered = guides.filter((guide) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        guide.guide_name?.toLowerCase().includes(searchLower) ||
        guide.short_description?.toLowerCase().includes(searchLower);
      const hasLocation = guide.locations && Array.isArray(guide.locations) && 
                         guide.locations.some(loc => loc === selectedLocation);
      const matchesLocation = selectedLocation === 'All Locations' || hasLocation;
      return matchesSearch && matchesLocation;
    });
    return filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  }, [searchTerm, selectedLocation, guides]);

  const hasGuidesForSelectedLocation = useMemo(() => {
    if (selectedLocation === 'All Locations') return true;
    return guides.some(guide => 
      guide.locations && Array.isArray(guide.locations) && 
      guide.locations.includes(selectedLocation)
    );
  }, [selectedLocation, guides]);

  const totalPages = Math.ceil(filteredGuides.length / guidesPerPage);
  const startIndex = (currentPage - 1) * guidesPerPage;
  const currentGuides = filteredGuides.slice(startIndex, startIndex + guidesPerPage);

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
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 translate-x-1/2" />

      {/* Immersive Hero Header */}
      <div className="relative h-[55vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Community & Culture"
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
            Locals Who Care
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Meet Your <span className="text-orange-500">Expert Guides</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Passionate locals ready to show you the heart and soul of Sri Lanka. Authentic stories guaranteed.
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
            placeholder="Search guides..."
            isLocationPage={false}
          />
        </div>

        {/* Loading State */}
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
              {/* No Guides for Selected Location */}
              {selectedLocation !== 'All Locations' && !hasGuidesForSelectedLocation && (
                <div className="text-center py-24 bg-orange-50/50 rounded-[2.5rem] border-2 border-dashed border-orange-200 mb-12">
                  <div className="inline-flex items-center justify-center size-24 bg-orange-100 rounded-full mb-6">
                    <span className="text-4xl">🧭</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No guides available for {selectedLocation}</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We're expanding our network! Try selecting a different location or browse all guides.
                  </p>
                </div>
              )}

              {/* Guides Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentGuides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <GuideCard
                      guide={guide}
                      rating={guide.averageRating || 0}
                      reviewCount={guide.reviewCount || 0}
                      onClick={() => navigate(`/guides/${guide.id}`)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* No Results from Search */}
              {filteredGuides.length === 0 && hasGuidesForSelectedLocation && (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center size-24 bg-gray-100 rounded-full mb-6">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No guides found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria.</p>
                </div>
              )}

              {/* Pagination */}
              {filteredGuides.length > guidesPerPage && (
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

export default GuidesSection;