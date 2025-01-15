import React, { useState } from 'react';
import { sendOTP, resetPassword } from '../../services/Api';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP and new password
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' });
  const [message, setMessage] = useState('');

  const handleSendOTP = async () => {
    try {
      const response = await sendOTP({ email: form.email });
      setMessage(response.data);
      setStep(2);
    } catch (error) {
      alert('Error sending OTP. Please check the email and try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await resetPassword(form);
      alert(response.data);
      setStep(1);
      setForm({ email: '', otp: '', newPassword: '' });
    } catch (error) {
      alert('Error resetting password. Please check the details and try again.');
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
        {message && <p className="message">{message}</p>}
        {step === 1 ? (
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="form-control"
            />
            <button onClick={handleSendOTP} className="send-otp-btn">Send OTP</button>
          </div>
        ) : (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <button onClick={handleResetPassword} className="reset-password-btn">Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;



