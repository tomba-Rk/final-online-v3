import React from 'react';
import { auth } from '../../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom'; // Import Link from React Router

const UserProfile = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>; // Center loading text
  }

  return (
    <div className="h-screen bg-gray-200 flex flex-col items-center justify-center p-4"> {/* Updated to flex-col */}
      <div className="w-full max-w-lg mx-auto bg-white border-4 border-black p-6 flex flex-col items-center mb-6"> {/* Use margin-bottom */}
        <div className="flex items-center space-x-4">
          <img
            className="w-20 h-20 border-4 border-black bg-gray-300" // Larger image with thick border
            src={user?.photoURL || '/default-profile.png'} // Replace with your default image path
            alt="Profile"
          />
          <p className="text-4xl font-bold">{user?.displayName || 'Anonymous User'}</p> {/* Larger, bolder text */}
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold underline decoration-black decoration-4">Referral Link</h3> {/* Underlined and bold text */}
          <span className="text-lg text-gray-700 mt-2 inline-block bg-gray-200 py-2 px-4 border-2 border-black">Coming Soon</span> {/* Emphasized message */}
        </div>
        {/* Add a Link to go back to the dashboard */}
        <Link to="/dashboard" className="mt-4 text-lg px-6 py-2 bg-black text-white rounded-sm font-bold border-2 border-black hover:bg-gray-700 transition-colors duration-300">Back to Dashboard</Link> 
      </div>
    </div>
  );
};

export default UserProfile;