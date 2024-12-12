// import React from 'react';
// import { Link } from 'react-router-dom';


// const ShopOwnerProfile = ({ user }) => {
//   return (
//     <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
//       <h2>Shop Owner Profile</h2>
//       <p>Name: {user.name}</p>
//       <p>Email: {user.email}</p>
//       <p>Role: {user.role}</p>
//       <Link to="ShopDetails">
//       <button>Add Shop Details</button></Link>

//     </div>
//   );
// };

// export default ShopOwnerProfile;

import React from 'react';
import { Link } from 'react-router-dom';

const ShopOwnerProfile = ({ user }) => {
  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '20px' }}>
      <h1>Hi, {user.name}!</h1>
      <h2>Shop Owner Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <div style={{ marginTop: '20px' }}>
        <Link to="/ShopDetails">
          <button style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>Add Shop Details</button>
        </Link>
        <Link to="/AddShop">
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>Add Shop</button>
        </Link>
      </div>
    </div>
  );
};

export default ShopOwnerProfile;