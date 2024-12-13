import React, { useState } from 'react';

import {  useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/Api';
import "./Register.css";
const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', role:'USER' });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div>
        <div className="register-page">
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="form-control"
                />
            </div>
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
            <button type="submit" className="register-btn">
                Register
            </button>
            </form>
            <div className="register-link-container">
                            <p>Already have an account?</p>
                            <Link to="/login" className="register-link">
                            Login here
                            </Link>
                        </div>
        </div>
        </div>
    </div>
  );
};

export default Register;