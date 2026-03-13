import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, DollarSign, 
  MapPinned, ChevronLeft, ChevronRight,
  ShoppingBag, Tag, Truck, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar';
import ReviewSection from '../ReviewSection';
import { getLocations } from '../../../services/api';
import { LocationCard } from '../locations/LocationCard';
import axios from 'axios';

const ShopDetail = ({ shop, onBack }) => {
  const reviews = shop.reviews || shop.reviews?.data || [];
  const averageRating = shop.reviews_avg_rating ? parseFloat(shop.reviews_avg_rating) : 0;
  const reviewCount = shop.reviews_count || reviews.length;

  const [items, setItems] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
  };

  const images = shop.images || [];

  useEffect(() => {
    const fetchShopLocations = async () => {
      if (shop?.locations && shop.locations.length > 0) {
        try {
          setLoading(true);
          const response = await getLocations();
          const allLocations = response.data;
          const shopLocations = allLocations.filter(location => 
            shop.locations.includes(location.locationName)
          );
          setLocations(shopLocations);
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchShopLocations();
  }, [shop]);

  useEffect(() => {
    const fetchShopItems = async () => {
      if (shop?.id) {
        try {
          const response = await axios.get(`${API_URL}/api/shops/${shop.id}/items`);
          setItems(response.data);
        } catch (error) {
          console.error('Error fetching shop items:', error);
        }
      }
    };
    fetchShopItems();
  }, [shop?.id]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/shops');
    }
  };

  const nextImage = () => {
    if (images.length) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (images.length) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!shop) return null;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      
      {/* Global Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-rose-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={images.length > 0 ? getImageUrl(images[currentImageIndex]?.image_path) : '/placeholder-shop.jpg'}
            alt={shop.shop_name || shop.shopName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-24 left-8 z-30 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-24 left-8 right-8 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/30">
                Curated Shop
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)} ({reviewCount} Reviews)
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight">
              {shop.shop_name || shop.shopName}
            </h1>
          </motion.div>
        </div>

        {/* Image Nav Buttons */}
        {images.length > 1 && (
          <div className="absolute bottom-24 right-8 z-30 flex gap-3">
            <button onClick={prevImage} className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextImage} className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 relative -mt-12 z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Description Section */}
            <motion.section 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-rose-100 rounded-2xl text-rose-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Shop Story</h2>
                  <p className="text-gray-500 font-medium">Discover local treasures and crafts</p>
                </div>
              </div>
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p className="text-xl font-medium leading-relaxed">
                  {shop.description}
                </p>
              </div>

              {/* Shopping Features */}
              <div className="mt-10 pt-10 border-t border-gray-100 flex flex-wrap gap-8">
                 <FeatureItem icon={<Tag className="w-5 h-5" />} label="Best Prices" />
                 <FeatureItem icon={<Truck className="w-5 h-5" />} label="Local Delivery" />
                 <FeatureItem icon={<CreditCard className="w-5 h-5" />} label="Secure Pay" />
              </div>
            </motion.section>

            {/* Items Grid Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Available Collection</h2>
                <span className="text-sm font-bold text-rose-500 uppercase tracking-widest">{items.length} Items</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {items.length > 0 ? (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -5 }}
                      className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-xl border border-white/50 group"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={getImageUrl(
                            (item.itemImage && typeof item.itemImage === 'string' && item.itemImage.startsWith('['))
                              ? JSON.parse(item.itemImage)[0]
                              : (Array.isArray(item.itemImage) ? item.itemImage[0] : item.image)
                          )}
                          alt={item.itemName || item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full font-bold text-rose-600 shadow-lg">
                          LKR {item.price}
                        </div>
                      </div>
                      <div className="p-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{item.itemName || item.name}</h4>
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                        <button className="text-rose-600 font-bold text-sm uppercase tracking-widest hover:text-rose-700 transition-colors flex items-center gap-2">
                          View Details <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="md:col-span-2 text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Coming soon to the shelves.</p>
                  </div>
                )}
              </div>
            </motion.section>

          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-8"
            >
              {/* Visit Card */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Visit Us</h3>
                
                <div className="space-y-4">
                  {(shop.shop_address || shop.shopAddress) && <InfoItem icon={<MapPinned className="text-rose-500" />} label="Location" value={shop.shop_address || shop.shopAddress} />}
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-xl shadow-gray-900/10">
                    <MapPinned className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Get Directions
                  </button>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Landscape Sections (Full Width) */}
        <div className="mt-16 space-y-16">
          {/* Reviews Section */}
          <motion.section 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Retail Reviews</h2>
                <p className="text-gray-500">What shoppers are sharing</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
            <ReviewSection entityType="shop" entityId={shop?.id} />
          </motion.section>

          {/* Nearby Locations */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Explore Nearby</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-[2.5rem]" />
                ))
              ) : locations.length > 0 ? (
                locations.map(loc => (
                  <div key={loc.id} className="transform hover:scale-[1.02] transition-all duration-300">
                    <LocationCard location={loc} rating={loc.reviews_avg_rating || 0} reviewCount={loc.reviews_count || 0} isClickable={false} />
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Discover what's around us.</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

const FeatureItem = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">{icon}</div>
    <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
    <div className="w-10 h-10 flex items-center justify-center">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none mb-1">{label}</p>
      <p className="text-gray-900 font-bold leading-none truncate">{value}</p>
    </div>
  </div>
);

export default ShopDetail;