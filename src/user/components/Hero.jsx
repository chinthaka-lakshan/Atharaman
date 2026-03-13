import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, MapPin, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_IMAGES = [
  'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80', // Sigiriya/Lanka vibe
  'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80', // Camping
  'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80', // Mountain
  'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80'  // Jungle
];

const Hero = ({ onScrollToSection }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image Carousel */}
      <AnimatePresence>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 2, ease: "circOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGES[currentImage]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1px]"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-start text-left max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-orange-500 font-black tracking-[0.4em] uppercase text-xs mb-6 block">
              Experience the Extraordinary
            </span>
            <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none">
              Explore <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
                The Unknown
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl font-medium leading-relaxed">
              Your gateway to Sri Lanka's most exclusive destinations. Every journey is curated for those who seek more than just a destination.
            </p>
          </motion.div>

          {/* New Integrated Search Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-3xl"
          >
            <div className="flex flex-col md:flex-row gap-2 p-1">
              <div className="flex-1 flex items-center space-x-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                <MapPin className="text-orange-500 size-6" />
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-black text-orange-500 tracking-widest mb-1">Destination</p>
                  <input 
                    type="text" 
                    placeholder="Where are you headed?" 
                    className="bg-transparent text-white border-none focus:ring-0 text-sm placeholder:text-white/40 w-full font-bold" 
                  />
                </div>
              </div>
              
              <div className="flex-1 flex items-center space-x-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                <Calendar className="text-emerald-500 size-6" />
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-black text-emerald-500 tracking-widest mb-1">Duration</p>
                  <p className="text-white text-sm font-bold cursor-pointer">Select Dates</p>
                </div>
              </div>

              <button className="bg-orange-500 text-white rounded-2xl px-12 py-5 font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/20">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 cursor-pointer z-10 opacity-70 hover:opacity-100 transition-opacity"
        onClick={() => onScrollToSection('locations')}
      >
        <span className="text-[10px] text-white uppercase font-black tracking-[0.5em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;