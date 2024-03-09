import React from 'react';
import photo from '../../images/paytm.jpg'; // Adjust the path to where you've saved your image
import { Link } from 'react-router-dom'; // Import Link from React Router

const PhotoRecharge = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="mt-8 bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
        <img src={photo} alt="A Display" className="w-full h-auto rounded-lg" />
        <p className="text-center my-4 text-sm font-normal text-gray-700">
          After making the payment, send the screenshot to this number:
          <span className="block font-bold text-lg mt-2 text-blue-700">6377883992</span>
          Your balance will be updated shortly.
        </p>
        <Link to="/dashboard" className="mt-4 text-lg px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 w-full text-center">
        Back to Dashboard
      </Link>
      </div>
    </div>
  );
};

export default PhotoRecharge;
