import React from 'react';
// import photo from '../../images/photo.jpg'; // Adjust the path to where you've saved your image
import { Link } from 'react-router-dom'; // Import Link from React Router
const PhotoRecharge = () => {
  return (
    <div className="mx-auto flex flex-col items-center w-full">
  {/* <img src={photo} alt="A Display" className="w-full h-auto" /> */}
  <p className="text-center my-4">
    After making the payment, Send the transaction ID to this number 
    <span className="block font-bold text-lg mt-2">6377883992</span>
     your balance will be updated shortly
  </p>
  <Link to="/dashboard" className="mt-4 text-lg px-6 py-2 bg-black text-white rounded-sm font-bold border-2 border-black hover:bg-gray-700 transition-colors duration-300 w-full text-center">Back to Dashboard</Link>
  {/* <MySvgComponent/> */}
</div>
    
  );
};

export default PhotoRecharge;