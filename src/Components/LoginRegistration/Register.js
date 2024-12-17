// import React, { useState } from 'react';

// import {  useNavigate } from 'react-router-dom';
// import { registerUser } from '../../services/Api';
// import "./Register.css";
// const Register = () => {
//   const [form, setForm] = useState({ username: '', email: '', password: '', role:'USER' });
//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await registerUser(form);
//       alert('Registration successful!');
//       navigate('/login');
//     } catch (err) {
//       alert('Registration failed');
//     }
//   };

//   return (
//     <div>
//         <div className="register-page">
//         <div className="register-container">
//             <h2>Register</h2>
//             <form onSubmit={handleSubmit}>
//             <div className="form-group">
//                 <input
//                 type="text"
//                 placeholder="Username"
//                 value={form.username}
//                 onChange={(e) => setForm({ ...form, username: e.target.value })}
//                 required
//                 className="form-control"
//                 />
//             </div>
//             <div className="form-group">
//                 <input
//                 type="email"
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 required
//                 className="form-control"
//                 />
//             </div>
//             <div className="form-group">
//                 <input
//                 type="password"
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 required
//                 className="form-control"
//                 />
//             </div>
//             <button type="submit" className="register-btn">
//                 Register
//             </button>
//             </form>
//         </div>
//         </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/Api';
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'USER' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirmPassword match
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    try {
      // Call API to register the user
      await registerUser({ 
        username: form.username, 
        email: form.email, 
        password: form.password, 
        role: form.role 
      });
      alert('Registration successful!');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      alert('Registration failed. Please try again.');
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
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="register-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
