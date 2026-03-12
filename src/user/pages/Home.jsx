import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';
import { getLocations, getGuides, getShops, getHotels, getVehicles } from "../../services/api";
import { useNavigate } from 'react-router-dom';
import {
  getWebsiteReviews,
  createWebsiteReview,
} from '../../services/api';

function Home() {
  const navigate = useNavigate();
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
      <Navbar onScrollToSection={scrollToSection} />

      <main className="overflow-hidden">
        <Hero onScrollToSection={scrollToSection} />

        <div className="space-y-20 py-12">
          <ProductSection
            id="locations"
            title="Top Locations"
            data={locations}
            type="location"
          />
          <ProductSection
            id="guides"
            title="Top Guides"
            data={guides}
            type="guide"
          />
          <ProductSection
            id="shops"
            title="Top Shops"
            data={shops}
            type="shop"
          />
          <ProductSection
            id="hotels"
            title="Top Hotels"
            data={hotels}
            type="hotel"
          />
          <ProductSection
            id="vehicles"
            title="Top Vehicles"
            data={vehicles}
            type="vehicle"
          />
        </div>

        {/* Website Reviews Section */}
        <div className="mt-12 pt-16 border-t max-w-7xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>

          {/* Summary */}
          {reviews.length > 0 ? (
            <div className="bg-white rounded-lg p-6 mb-6 shadow">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mt-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ) : (
            !reviewsLoading && (
              <div className="bg-white rounded-lg p-6 mb-6 text-center shadow">
                <p className="text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            )
          )}

          {/* Review List */}
          <div className="space-y-4 mb-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600">
                    by {review.user?.name || 'Anonymous'}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <form
            onSubmit={handleSubmitReview}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
            <div className="flex gap-2 mb-4">
              {renderStars(newReview.rating, true)}
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Write your review..."
              className="w-full border rounded-lg p-2 mb-4"
              rows="3"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </form>
        </div>

        <AboutUs />
      </main>
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default Home;