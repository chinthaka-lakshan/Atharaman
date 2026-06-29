import React from 'react';
import { Award, Users, Globe, Heart, ShieldCheck, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const features = [
    {
      icon: <Award className="size-8" />,
      title: "Certified Excellence",
      description: "Our services are recognized and certified by global travel authorities."
    },
    {
      icon: <Users className="size-8" />,
      title: "Local Community",
      description: "We work directly with local families and guides to provide authentic experiences."
    },
    {
      icon: <Globe className="size-8" />,
      title: "Hidden Gems",
      description: "Access curated locations that you won't find in any standard guidebook."
    },
    {
      icon: <ShieldCheck className="size-8" />,
      title: "Secure & Safe",
      description: "Your safety is our top priority, with 24/7 support throughout your journey."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Dynamic Background Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 rounded-l-[20rem] -z-10 translate-x-1/4 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-orange-50/50 rounded-r-[15rem] -z-10 -translate-x-1/4 opacity-30 blur-2xl"></div>

      <div className="max-w-full px-6 lg:px-12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Visual Side */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="pt-12"
              >
                <img 
                  src="https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Adventure" 
                  className="rounded-[3rem] shadow-xl aspect-[3/4] object-cover" 
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <img 
                  src="https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Culture" 
                  className="rounded-[3rem] shadow-xl aspect-[3/4] object-cover" 
                />
              </motion.div>
            </div>
            
            {/* Achievement Badge */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-full shadow-2xl border-4 border-emerald-500 animate-float"
            >
              <Sun className="size-12 text-emerald-500" />
            </motion.div>
          </div>

          {/* Text Side */}
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] uppercase font-black tracking-[0.4em] text-emerald-600 mb-6 block"
            >
              Our Story
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Creating Memories That <span className="text-emerald-600">Last Forever</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-medium">
              We travel not to escape life, but for life not to escape us. Atharaman was built to redefine how you explore the Pearl of the Indian Ocean.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
              {features.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-snug">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;