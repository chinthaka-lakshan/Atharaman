import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Mountain } from 'lucide-react';

const Footer = ({ onScrollToSection }) => {
  const socialLinks = [
    { icon: <Facebook className="size-6" />, href: "#", name: "Facebook" },
    { icon: <Twitter className="size-6" />, href: "#", name: "Twitter" },
    { icon: <Instagram className="size-6" />, href: "#", name: "Instagram" },
    { icon: <Youtube className="size-6" />, href: "#", name: "YouTube" }
  ];

  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Locations', id: 'locations' },
    { name: 'Guides', id: 'guides' }
  ];

  const services = [
    { name: 'Shops', id: 'shops' },
    { name: 'Hotels', id: 'hotels' },
    { name: 'Vehicles', id: 'vehicles' },
    { name: 'Adventure Packages', id: 'home' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Mountain className="size-8 text-orange-500" />
              <h3 className="text-2xl font-bold">Atharaman</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your gateway to extraordinary adventures. Discover breathtaking destinations,
              connect with expert guides, and create memories that last a lifetime.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="size-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => onScrollToSection(link.id)}
                    className="text-gray-300 hover:text-orange-400 transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-2"
                  >
                    <span className="size-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => onScrollToSection(service.id)}
                    className="text-gray-300 hover:text-orange-400 transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-2"
                  >
                    <span className="size-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Battaramulla<br />
                  Colombo<br />
                  Sri Lanka
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-orange-500 flex-shrink-0" />
                <p className="text-gray-300">+94 (77) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-orange-500 flex-shrink-0" />
                <p className="text-gray-300">hello@atharaman.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-6">Subscribe to our newsletter for the latest adventures and exclusive offers</p>
            <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-orange-500/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Atharaman. All rights reserved. |
            <a href="/privacy" className="hover:text-orange-400 transition-colors mx-1">Privacy Policy</a> |
            <a href="/terms" className="hover:text-orange-400 transition-colors mx-1">Terms of Service</a>
          </p>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-green-500 animate-gradient-x"></div>
    </footer>
  );
};

export default Footer;