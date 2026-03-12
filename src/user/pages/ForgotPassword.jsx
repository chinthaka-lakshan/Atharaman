import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendResetLink } from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await sendResetLink({ email });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 animate-fade-in"
          aria-label="Back to home"
        >
          <ArrowLeft className="size-5" />
          <span>Back to Home</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in [animation-delay:100ms]">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Mail className="size-8 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                <p className="text-gray-600">
                  No worries! Enter your email address and we'll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                    required
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send password reset link"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full size-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-5" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    <p className="font-medium mb-1">Can't find your email?</p>
                    <p>Check your spam folder or contact our support team for assistance.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Check className="size-8 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong className="break-all">{email}</strong>
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transform hover:scale-[1.02] transition-all duration-200"
                    aria-label="Send another reset email"
                  >
                    Send Another Email
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    aria-label="Return to home page"
                  >
                    Back to Home
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Check your email inbox for the reset link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Click the link to create a new password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>The link will expire in 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Contact support if you don't receive the email</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Support Link */}
        <div className="text-center mt-6 animate-fade-in [animation-delay:200ms]">
          <p className="text-gray-600">
            Still having trouble?{' '}
            <a
              href="mailto:support@atharaman.com"
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              aria-label="Contact support"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;