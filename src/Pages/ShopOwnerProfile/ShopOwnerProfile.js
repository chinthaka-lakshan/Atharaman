import React from 'react';
import { Link } from 'react-router-dom';

const ShopOwnerProfile = ({ user }) => {
  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>Shop Owner Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <Link to="ShopDetails">
      <button>Add Shop Details</button></Link>

    </div>
  );
};

export default ShopOwnerProfile;