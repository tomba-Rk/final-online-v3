import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  const userPhotoURL = user?.photoURL || 'default-profile-img-url'; // Replace the default URL with an actual default image URL

  return (
    <nav className="bg-gray-900 border-b-4 border-black p-4">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/userprofile" className="text-white text-lg font-bold hover:text-gray-300">
            {user?.displayName || 'User'}
          </Link>
        </div>
        <div className="flex items-center">
          <button className="text-white text-lg font-bold mr-4 hover:text-gray-300">
            <i className="fas fa-bars"></i>
          </button>
          <Link to="/userprofile" className="block">
            <img
              src={userPhotoURL}
              alt="User"
              className="h-10 w-10 object-cover rounded-full border-2 border-white cursor-pointer hover:border-gray-300"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;