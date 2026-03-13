import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Mail, Phone, 
  ChevronLeft, ChevronRight, IdCardIcon, 
  Languages, GraduationCap, Map
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar';
import ReviewSection from '../ReviewSection';
import { getLocations } from '../../../services/api';
import { LocationCard } from '../locations/LocationCard';
import { STORAGE_BASE_URL } from '../../../config/runtimeConfig';

const GuideDetail = ({ guide, onBack }) => {
  const reviews = guide.reviews || guide.reviews?.data || [];
  const averageRating = guide.reviews_avg_rating ? parseFloat(guide.reviews_avg_rating) : 0;
  const reviewCount = guide.reviews_count || reviews.length;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get images directly from backend structure
  const images = guide.images || [];

  useEffect(() => {
    const fetchGuideLocations = async () => {
      if (guide?.locations && guide.locations.length > 0) {
        try {
          setLoading(true);
          const response = await getLocations();
          const allLocations = response.data;
          const guideLocations = allLocations.filter(location => 
            guide.locations.includes(location.locationName || location.name)
          );
          setLocations(guideLocations);
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchGuideLocations();
  }, [guide]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/guides');
    }
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!guide) return null;

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
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={images.length > 0 ? `${STORAGE_BASE_URL}/${images[currentImageIndex].image_path}` : '/placeholder-guide.jpg'}
            alt={guide.guide_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-24 left-24 z-30 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-24 left-24 right-24 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/30">
                Professional Guide
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)} ({reviewCount} Reviews)
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight">
              {guide.guide_name}
            </h1>
          </motion.div>
        </div>

        {/* Image Nav Buttons */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage} 
              className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/40 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 relative -mt-12 z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Bio Section */}
            <motion.section 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">About the Guide</h2>
                  <p className="text-gray-500 font-medium">Passion, expertise, and local stories</p>
                </div>
              </div>
              <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
                <p className="text-xl font-medium leading-relaxed">
                  {guide.short_description}
                </p>
                {guide.long_description && (
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {guide.long_description}
                  </p>
                )}
              </div>

              {/* Badges Section */}
              <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.languages && guide.languages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Languages className="w-4 h-4" /> Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.languages.map((lang, i) => (
                        <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {guide.locations && guide.locations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Map className="w-4 h-4" /> Service Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.locations.map((loc, i) => (
                        <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm">
                          {loc}
                        </span>
                      ))}
                    </div>
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
              {/* Contact Card */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 space-y-8">
                <div className="text-center group">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-3xl overflow-hidden shadow-xl transform group-hover:scale-105 transition-transform">
                    <img 
                      src={images.length > 0 ? `${STORAGE_BASE_URL}/${images[0].image_path}` : '/placeholder-avatar.jpg'} 
                      className="w-full h-full object-cover"
                      alt={guide.guide_name}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{guide.guide_name}</h3>
                  <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mt-1">Verified Guide</p>
                </div>

                <div className="space-y-4">
                  {guide.guide_nic && <ContactItem icon={<IdCardIcon className="text-blue-500" />} label="Guide ID" value={guide.guide_nic} />}
                  {guide.contact_number && <ContactItem icon={<Phone className="text-emerald-500" />} label="Direct Call" value={guide.contact_number} isLink href={`tel:${guide.contact_number}`} />}
                  {guide.business_mail && <ContactItem icon={<Mail className="text-orange-500" />} label="Email" value={guide.business_mail} isLink href={`mailto:${guide.business_mail}`} />}
                </div>

                <div className="flex flex-col gap-3">
                  <a 
                    href={guide.whatsapp_number ? `https://wa.me/${guide.whatsapp_number}` : '#'}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-emerald-600/20"
                  >
                    <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Chat on WhatsApp
                  </a>
                  <a 
                    href={`mailto:${guide.business_mail}`}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-xl shadow-gray-900/10"
                  >
                    <Mail className="w-5 h-5" />
                    Inquiry via Email
                  </a>
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
                <h2 className="text-3xl font-bold text-gray-900">Guest Feedback</h2>
                <p className="text-gray-500">Experiences shared by recent travelers</p>
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
            <ReviewSection entityType="guide" entityId={guide?.id} />
          </motion.section>

          {/* Specialized Locations */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Specialized Destinations</h2>
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
                  <p className="text-gray-500 font-medium">No specialized locations listed yet.</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

const ContactItem = ({ icon, label, value, isLink, href }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-white transition-colors">
    <div className="w-10 h-10 flex items-center justify-center">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none mb-1">{label}</p>
      {isLink ? (
        <a href={href} className="text-gray-900 font-bold leading-none hover:text-emerald-600 transition-colors truncate block">
          {value}
        </a>
      ) : (
        <p className="text-gray-900 font-bold leading-none truncate">{value || 'N/A'}</p>
      )}
    </div>
  </div>
);

export default GuideDetail;