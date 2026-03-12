import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Calendar, Clock, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loginTime, setLoginTime] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  useEffect(() => {
    // Set login time when component mounts
    setLoginTime(new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }));
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const openLogoutConfirmation = () => {
    setIsDropdownOpen(false);
    setIsConfirmOpen(true);
  };

  const closeLogoutConfirmation = () => {
    setIsConfirmOpen(false);
  };

  const handleLogout = async () => {
    closeLogoutConfirmation();
    await logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Custom Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!isConfirmOpen) return null;

    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 transform transition-all duration-200 scale-95 animate-in fade-in-90 zoom-in-90">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
            </div>
            <button
              onClick={closeLogoutConfirmation}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-6">
            <p className="text-gray-600 mb-1">Are you sure you want to logout?</p>
            <p className="text-sm text-gray-500">You'll need to sign in again to access the admin dashboard.</p>
          </div>
          
          {/* Modal Footer */}
          <div className="flex gap-3 p-6 bg-gray-50 rounded-b-xl">
            <button
              onClick={closeLogoutConfirmation}
              className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 h-16 fixed top-0 left-64 right-0 z-40">
        <div className="h-full flex items-center justify-between px-6 relative">

          {/* Spacer */}
          <div className="w-32"></div>

          {/* Centered Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-semibold text-gray-800">ATHARAMAN DASHBOARD</h1>
          </div>

          {/* Profile & Username */}
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <span className="text-gray-700 font-medium">
              {user ? user.name : 'Loading...'}
            </span>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="User menu"
            >
              <User className="text-indigo-600 text-xl" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-0 right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-3 overflow-hidden">
                {/* Profile Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm border border-gray-200">
                      <User className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 truncate">{user?.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                    </div>
                  </div>
                  
                  {/* Role Badge */}
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                    {user?.role || 'Administrator'}
                  </div>
                </div>
                
                {/* Login Information */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Calendar size={14} />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>Logged in at {loginTime}</span>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={openLogoutConfirmation}
                  className="w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Custom Confirmation Modal */}
      <ConfirmationModal />
    </>
  );
};

export default Navbar;