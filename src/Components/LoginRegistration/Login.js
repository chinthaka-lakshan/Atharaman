import React, { useState } from 'react';
import { loginUser } from '../../services/Api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'
import Navbar from '../Navbar/Navbar';

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(form);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/profile'); // Automatically route to the profile page
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
        <Navbar/>
        <div className="login-page">
            <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
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
                <button type="submit" className="login-btn">
                Login
                </button>
            </form>
            <div className="register-link-container">
                <p>Don't have an account?</p>
                <Link to="/register" className="register-link">
                Register here
                </Link>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Login;