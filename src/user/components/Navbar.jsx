import React, { useState } from 'react';
import { Menu, X, User, ChevronDown, LogOut, Settings, Shield, FileText } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ onScrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Locations', path: '/locations' },
    { name: 'Guides', path: '/guides' },
    { name: 'Shops', path: '/shops' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'Vehicles', path: '/vehicles' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-green-800 cursor-pointer hover:text-green-600 transition-colors"
              >
                Atharaman
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Login/Profile Section */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
                  >
                    <User className="size-5" />
                    <span>{user.name}</span>
                    <ChevronDown className="size-4" />
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 origin-top-right"
                      onMouseLeave={() => setIsProfileDropdownOpen(false)}
                    >
                      <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <User className="size-4 mr-3" />
                        Your Profile
                      </a>
                      <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <Settings className="size-4 mr-3" />
                        Settings
                      </a>
                      <a href="/privacy-policy" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <Shield className="size-4 mr-3" />
                        Privacy Policy
                      </a>
                      <a href="/terms-and-conditions" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <FileText className="size-4 mr-3" />
                        Terms & Conditions
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="size-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-orange-500/20"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 focus:outline-none transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden transition-all duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="text-gray-700 hover:text-orange-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                >
                  {item.name}
                </button>
              ))}
              {isAuthenticated && user ? (
                <div className="border-t pt-3">
                  <div className="flex items-center px-3 py-2">
                    <User className="size-5 mr-2" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold w-full mt-3 transition-all duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onLogin={handleLoginSuccess}
      />
      
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onRegister={handleRegisterSuccess}
      />
    </>
  );
};

export default Navbar;