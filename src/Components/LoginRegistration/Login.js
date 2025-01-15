import React, { useState } from 'react';
import { loginUser, sendVerificationCode, resetPassword } from '../../services/Api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetPasswordState, setResetPasswordState] = useState(false);
  const [forgotForm, setForgotForm] = useState({ email: '', otp: '', newPassword: '' });
  const [popupMessage, setPopupMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopupMessage(message);
    setIsPopupVisible(true);
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(form);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/profile');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      showPopup('Please wait until verification...');
      const response = await sendVerificationCode({ email: forgotForm.email });
      hidePopup();
      showPopup('OTP has been sent to your Gmail.');
      setTimeout(hidePopup, 3000); // Automatically hide popup after 3 seconds
      setForgotPassword(false);
      setResetPasswordState(true);
    } catch (err) {
      hidePopup();
      alert('Failed to send OTP. Please check the email.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPassword(forgotForm);
      alert('Password changed successfully. Please log in.');
      setResetPasswordState(false);
      navigate('/login');
    } catch (err) {
      alert('Failed to reset password. Please check your details.');
    }
  };

  return (
    <div className="login-page">
      {isPopupVisible && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
      <div className="login-container">
        {forgotPassword ? (
          <form onSubmit={handleForgotPassword} className="login-form">
            <h2>Forgot Password</h2>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotForm.email}
                onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="login-btn">Send OTP</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setForgotPassword(false)}
            >
              Cancel
            </button>
          </form>
        ) : resetPasswordState ? (
          <form onSubmit={handleResetPassword} className="login-form">
            <h2>Reset Password</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter OTP"
                value={forgotForm.otp}
                onChange={(e) => setForgotForm({ ...forgotForm, otp: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Enter new password"
                value={forgotForm.newPassword}
                onChange={(e) => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="login-btn">Reset Password</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Login</h2>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
            <button
              type="button"
              className="forgot-password-btn"
              onClick={() => setForgotPassword(true)}
            >
              Forgot Password
            </button>
          </form>
        )}
        {!forgotPassword && !resetPasswordState && (
          <div className="register-link-container">
            <p>Don't have an account?</p>
            <Link to="/register" className="register-link">Register here</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;


