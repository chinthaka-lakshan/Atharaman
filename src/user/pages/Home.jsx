import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../../contexts/AuthContext';
import { getLocations, getGuides, getShops, getHotels, getVehicles } from "../../services/api";
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  Palmtree, 
  Mountain, 
  Camera, 
  ShieldCheck, 
  Zap, 
  TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getWebsiteReviews,
  createWebsiteReview,
} from '../../services/api';


function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [locations, setLocations] = useState([]);
  const [guides, setGuides] = useState([]);
  const [shops, setShops] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Fetch all data with proper error handling
    const fetchData = async () => {
      try {
        // Fetch locations with ratings
        const locationsRes = await getLocations();
        const locationsWithRatings = locationsRes.data.map(location => ({
          ...location,
          averageRating: location.reviews_avg_rating || 0,
          reviewCount: location.reviews_count || 0
        }));
        setLocations(locationsWithRatings);

        // Fetch guides with ratings
        const guidesRes = await getGuides();
        const guidesWithRatings = guidesRes.data.map(guide => ({
          ...guide,
          averageRating: guide.reviews_avg_rating || 0,
          reviewCount: guide.reviews_count || 0
        }));
        setGuides(guidesWithRatings);

        // Fetch other data
        const shopsRes = await getShops();
        setShops(shopsRes.data);
        
        const hotelsRes = await getHotels();
        setHotels(hotelsRes.data);
        
        const vehiclesRes = await getVehicles();
        setVehicles(vehiclesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch Website Reviews
  useEffect(() => {
    const fetchWebsiteReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await getWebsiteReviews();
        setReviews(response.data);

        if (response.data.length > 0) {
          const totalRating = response.data.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          setAverageRating(totalRating / response.data.length);
        }
      } catch (error) {
        console.error('Error fetching website reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchWebsiteReviews();
  }, []);

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const response = await createWebsiteReview(newReview);
      setReviews([...reviews, response.data.websiteReview]);
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  // Render stars
  const renderStars = (rating, clickable = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        onClick={() =>
          clickable && setNewReview({ ...newReview, rating: i + 1 })
        }
        className={`cursor-${
          clickable ? 'pointer' : 'default'
        } text-2xl transition ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="relative overflow-hidden">
        {/* Natural & Colorful Background Atmosphere */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          {/* Vibrant Background Blobs */}
          <div className="absolute top-[5%] -left-[10%] w-[45%] aspect-square bg-orange-400/20 blur-[150px] rounded-full animate-pulse-slow"></div>
          <div className="absolute top-[30%] -right-[15%] w-[55%] aspect-square bg-emerald-400/15 blur-[180px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-[20%] -left-[20%] w-[65%] aspect-square bg-sky-400/10 blur-[200px] rounded-full animate-pulse-slow" style={{ animationDelay: '6s' }}></div>
          
          {/* Global Pattern Overlay for "Natural" Feel */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{ 
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
              backgroundRepeat: 'repeat'
            }}
          ></div>
        </div>

        <Hero onScrollToSection={scrollToSection} />

        <div className="relative z-10">
          <ProductSection
            id="locations"
            title="Top Locations"
            data={locations}
            type="location"
          />

          {/* Natural Separator - Tropical Coastline */}
          <div className="h-[400px] w-full relative overflow-hidden my-12 group">
            <img 
              src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1600" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Experience Sri Lanka"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-12 lg:px-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="max-w-xl"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover the Unexplored</h3>
                <p className="text-white/80 text-lg font-medium">From misty mountains to golden shores, every corner of Sri Lanka holds a story waiting to be told.</p>
              </motion.div>
            </div>
          </div>

          <ProductSection
            id="guides"
            title="Top Guides"
            data={guides}
            type="guide"
          />

          {/* Natural Separator - Tea Estates */}
          <div className="h-[400px] w-full relative overflow-hidden my-12 group">
            <img 
              src="https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg?auto=compress&cs=tinysrgb&w=1600" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Local Culture"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex items-center justify-end px-12 lg:px-24">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="max-w-xl text-right"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Journey with Experts</h3>
                <p className="text-white/80 text-lg font-medium">Our local guides don't just show you places; they open doors to authentic experiences and hidden treasures.</p>
              </motion.div>
            </div>
          </div>

          <ProductSection
            id="shops"
            title="Top Shops"
            data={shops}
            type="shop"
          />

          {/* Natural Separator - Tea Hills / Hillsides */}
          <div className="h-[400px] w-full relative overflow-hidden my-12 group">
            <img 
              src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1600" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Sri Lankan Tea Hills"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-transparent flex items-center px-12 lg:px-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="max-w-xl"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Pure Ceylon Treasures</h3>
                <p className="text-white/80 text-lg font-medium">Explore the finest collections of Sri Lankan craftsmanship, from world-renowned tea to intricate local arts.</p>
              </motion.div>
            </div>
          </div>

          <ProductSection
            id="hotels"
            title="Top Hotels"
            data={hotels}
            type="hotel"
          />

          {/* Natural Separator - Luxury Nature Stay */}
          <div className="h-[400px] w-full relative overflow-hidden my-12 group">
            <img 
              src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Luxury Escapes"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-sky-900/60 to-transparent flex items-center justify-end px-12 lg:px-24">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="max-w-xl text-right"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Rest in Paradise</h3>
                <p className="text-white/80 text-lg font-medium">From boutique villas to world-class resorts, find your perfect home away from home in the heart of nature.</p>
              </motion.div>
            </div>
          </div>

          <ProductSection
            id="vehicles"
            title="Top Vehicles"
            data={vehicles}
            type="vehicle"
          />
        </div>

        {/* Refined Website Reviews Section - Compact & Official */}
        <section className="py-20 bg-white relative z-10">
          <div className="max-w-[1400px] px-6 lg:px-12 mx-auto">
            <div className="flex flex-col gap-12">
              
              {/* Refined Header & Compact Rating */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                  >
                    <span className="text-[10px] uppercase font-black tracking-[0.4em] text-emerald-600 mb-4 block">
                      TRAVELER VOICES
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                      What our <br /> 
                      <span className="text-emerald-600">Travelers Say</span>
                    </h2>
                  </motion.div>
                </div>

                {reviews.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-6 bg-emerald-50/50 backdrop-blur-md border border-emerald-100 p-6 rounded-2xl shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-4xl font-black text-emerald-600 leading-none mb-1">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">
                        Official Score
                      </span>
                    </div>
                    <div className="h-10 w-[1px] bg-emerald-200"></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        {renderStars(Math.round(averageRating))}
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">
                        Based on {reviews.length} Experiences
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Grid of Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.slice(-6).reverse().map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 font-medium italic mb-6 leading-relaxed line-clamp-4">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                      <div className="size-10 bg-emerald-100 rounded-xl flex items-center justify-center font-bold text-emerald-600 text-sm shadow-inner">
                        {review.user?.name?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{review.user?.name || 'Explorer'}</p>
                        <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-black uppercase tracking-widest">
                          <Zap className="size-2 fill-current" />
                          Verified
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sleek CTA Banner */}
              {!isAuthenticated ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="bg-gray-900 rounded-3xl p-10 md:p-12 text-center relative overflow-hidden group shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors"></div>
                  
                  <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Become a Contributor</h3>
                    <p className="text-gray-400 mb-8 font-medium">Join our community to share your authentic Sri Lankan travel experiences and help fellow explorers.</p>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                    >
                      Login to Share Experience
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="bg-gray-50 p-10 rounded-3xl border-2 border-dashed border-gray-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Share Your Adventure</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="flex gap-4 p-4 bg-white rounded-2xl w-fit shadow-sm border border-gray-100">
                      {renderStars(newReview.rating, true)}
                    </div>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Help others discover amazing places..."
                      className="w-full bg-white border-none focus:ring-2 focus:ring-emerald-500/20 rounded-2xl p-6 min-h-[120px] shadow-sm text-gray-700"
                    />
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 text-white rounded-xl py-4 font-bold hover:bg-emerald-700 transition-all shadow-lg"
                    >
                      Post Review
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <AboutUs />

        <div className="py-20"></div>

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
          onLogin={() => setIsLoginModalOpen(false)}
        />
      </main>
    </div>
  );
}

export default Home;