import React from 'react';
import UserProfile from '../components/UserProfile';

function UserProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        <UserProfile />
      </main>
    </div>
  );
}

export default UserProfilePage;