// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
// import { getUserProfile, submitRequest, deleteUser } from '../../services/Api';
// import './UserProfile.css';

// const UserProfile = ({ user }) => {
//   const [profile, setProfile] = useState(null);
//   const [currentForm, setCurrentForm] = useState(null);
//   const [requestDetails, setRequestDetails] = useState({
//     birthday: '',
//     number: '',
//     contactNumber: '',
//     experience: '',
//   });
//   const [hasPendingRequest, setHasPendingRequest] = useState(false);

//   const navigate = useNavigate(); // Initialize the navigation hook

//   useEffect(() => {
//     if (user) {
//       getUserProfile(user.id)
//         .then(({ data }) => {
//           setProfile(data);
//           if (data.requestStatus === 'PENDING') {
//             setHasPendingRequest(true);
//           }
//         })
//         .catch((err) => {
//           console.error('Error fetching user profile:', err);
//         });
//     }
//   }, [user]);




// const handleDeleteUser = async () => {
//     if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
//       try {
//         await deleteUser(user.id);
//         localStorage.clear(); // Clear all local storage
//         alert('Profile deleted successfully.');
//         navigate('/'); // Navigate to the login page after deletion
//       } catch (err) {
//         console.error('Error deleting profile:', err);
//         alert('Failed to delete profile.');
//       }
//     }
//   };
  



//   const handleSubmitRequest = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         user: { id: user.id },
//         type: currentForm,
//         status: 'PENDING',
//         birthday: requestDetails.birthday,
//         number: requestDetails.number,
//         contactNumber: requestDetails.contactNumber,
//         experience: requestDetails.experience,
//       };

//       const { data } = await submitRequest(payload);
//       alert(`Request for ${currentForm} submitted successfully. Please wait for admin approval.`);
//       setHasPendingRequest(true);
//       setCurrentForm(null);
//       setRequestDetails({
//         birthday: '',
//         number: '',
//         contactNumber: '',
//         experience: '',
//       });
//     } catch (err) {
//       console.error('Error submitting request:', err);
//       alert('Failed to submit request.');
//     }
//   };

//   if (!profile) return <p className="user-loading-text">Loading...</p>;

//   return (
//     <div className="user-page">
//       <div className="user-profile-container">
//         <h1 className="user-welcome-message">Welcome, {profile.username}</h1>
//         <div className="user-profile-details">
//           <p>Email: <span>{profile.email}</span></p>
//           <p>Role: <span>{profile.role || 'USER'}</span></p>
//         </div>

//         <div className="user-requests-section">
//           <h2>Requests</h2>
//           {hasPendingRequest ? (
//             <p className="user-user-pending-message">You have a pending request. Please wait for admin approval.</p>
//           ) : (
//             <>
//               <button onClick={() => setCurrentForm('GUIDE')} className="btn request-btn">Request to Become a Guide</button>
//               <button onClick={() => setCurrentForm('SHOP_OWNER')} className="btn request-btn">Request to Become a Shop Owner</button>
//             </>
//           )}
//         </div>

//         {currentForm && (
//           <form onSubmit={handleSubmitRequest} className="request-form">
//             <h3>{currentForm === 'GUIDE' ? 'Guide Request Form' : 'Shop Owner Request Form'}</h3>
//             <div className="user-form-group">
//               <label>Birthday:</label>
//               <input
//                 type="date"
//                 value={requestDetails.birthday}
//                 onChange={(e) => setRequestDetails({ ...requestDetails, birthday: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="user-form-group">
//               <label>{currentForm === 'GUIDE' ? 'Guide Number:' : 'Shop Number:'}</label>
//               <input
//                 type="text"
//                 value={requestDetails.number}
//                 onChange={(e) => setRequestDetails({ ...requestDetails, number: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="user-form-group">
//               <label>Contact Number:</label>
//               <input
//                 type="text"
//                 value={requestDetails.contactNumber}
//                 onChange={(e) => setRequestDetails({ ...requestDetails, contactNumber: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="user-form-group">
//               <label>Experience:</label>
//               <textarea
//                 value={requestDetails.experience}
//                 onChange={(e) => setRequestDetails({ ...requestDetails, experience: e.target.value })}
//                 required
//                 placeholder="Describe your experience..."
//               />
//             </div>
//             <div className="user-form-actions">
//               <button type="submit" className="btn submit-btn">Submit Request</button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setCurrentForm(null);
//                   setRequestDetails({
//                     birthday: '',
//                     number: '',
//                     contactNumber: '',
//                     experience: '',
//                   });
//                 }}
//                 className="user-btn cancel-btn"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}

//         <div className="user-delete-profile-section">
//           <h2>Delete Profile</h2>
//           <button onClick={handleDeleteUser} className="btn delete-btn">Delete Profile</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, submitRequest, deleteUser } from '../../services/Api';
import GuideRequestForm from '../../Pages/RequestFoms/GuideRequestForm';
import ShopOwnerRequestForm from '../../Pages/RequestFoms/ShopOwnerRequestForm';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [currentForm, setCurrentForm] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserProfile(user.id)
        .then(({ data }) => {
          setProfile(data);
          if (data.requestStatus === 'PENDING') {
            setHasPendingRequest(true);
          }
        })
        .catch((err) => {
          console.error('Error fetching user profile:', err);
        });
    }
  }, [user]);

  const handleDeleteUser = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await deleteUser(user.id);
        localStorage.clear();
        alert('Profile deleted successfully.');
        navigate('/');
      } catch (err) {
        console.error('Error deleting profile:', err);
        alert('Failed to delete profile.');
      }
    }
  };

  const handleSubmitRequest = async (formData) => {
    try {
      const payload = {
        user: { id: user.id },
        type: currentForm,
        status: 'PENDING',
        ...formData,
      };

      const { data } = await submitRequest(payload);
      alert(`Request for ${currentForm} submitted successfully. Please wait for admin approval.`);
      setHasPendingRequest(true);
      setCurrentForm(null);
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Failed to submit request.');
    }
  };

  if (!profile) return <p className="user-loading-text">Loading...</p>;

  return (
    <div className="user-page">
      <div className="user-profile-container">
        <h1 className="user-welcome-message">Welcome, {profile.username}</h1>
        <div className="user-profile-details">
          <p>Email: <span>{profile.email}</span></p>
          <p>Role: <span>{profile.role || 'USER'}</span></p>
        </div>

        <div className="user-requests-section">
          <h2>Requests</h2>
          {hasPendingRequest ? (
            <p className="user-user-pending-message">You have a pending request. Please wait for admin approval.</p>
          ) : (
            <>
              <button onClick={() => setCurrentForm('GUIDE')} className="btn request-btn">Request to Become a Guide</button>
              <button onClick={() => setCurrentForm('SHOP_OWNER')} className="btn request-btn">Request to Become a Shop Owner</button>
            </>
          )}
        </div>

        {currentForm === 'GUIDE' && (
          <GuideRequestForm onSubmit={handleSubmitRequest} onCancel={() => setCurrentForm(null)} />
        )}

        {currentForm === 'SHOP_OWNER' && (
          <ShopOwnerRequestForm onSubmit={handleSubmitRequest} onCancel={() => setCurrentForm(null)} />
        )}

        <div className="user-delete-profile-section">
          <h2>Delete Profile</h2>
          <button onClick={handleDeleteUser} className="btn delete-btn">Delete Profile</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;