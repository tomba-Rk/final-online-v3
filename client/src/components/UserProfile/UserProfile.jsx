import React, { useState,useEffect } from 'react';
import { auth,db } from '../../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { doc, onSnapshot } from "firebase/firestore";
const UserProfile = () => {
  const [user, loading] = useAuthState(auth);
  const [referallink,setReferallink]=useState('');
  const [userBalanceShow, setUserBalanceShow] = useState(null);
  const [award, setAward] = useState(null);
  useEffect(() => {
    if (user && user.uid) {
        const unsubscribe = onSnapshot(doc(db, "Customers", user.uid), (doc) => {
            let newInput = doc.data()?.referralLink;
            let newInputTwo = doc.data()?.userBalance;
            let newInputThree = doc.data()?.award;
            console.log("Current data: ", newInput);
            console.log("newInput type:", typeof (newInput));
            setReferallink(newInput);
            setUserBalanceShow(newInputTwo);
            setAward(newInputThree);
        });

        // Clean up subscription on unmount
        return () => unsubscribe();
    }
}, [user]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>; // Center loading text
  }

  return (
    <div className="h-screen bg-gray-200 flex flex-col items-center justify-center p-4" > {/* Updated to flex-col */}
      <div class="h-screen bg-gray-200 flex items-center justify-center" >
    <div class="bg-white rounded-3xl shadow-xl p-6" style={{ width: '490px' }}>
      <div class="flex flex-col items-center">
        <img class="h-24 w-24 rounded-full mb-4" src="https://placehold.co/96x96" alt="Profile picture placeholder" />
        <h2 class="text-xl font-semibold mb-1">William John Malik</h2>
        <p class="text-gray-600 mb-6">Aggressive Investor</p>
        <div class="space-y-2 w-full">
          {/* <!-- Menu Items --> */}
          <a href="#" class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <i class="fas fa-user-circle text-blue-500 mr-3"></i>
              Personal Data
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </a>
          <a href="#" class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <i class="fas fa-cog text-blue-500 mr-3"></i>
              Settings
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </a>
          <a href="#" class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <i class="fas fa-file-alt text-blue-500 mr-3"></i>
              E-Statement
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </a>
          <a href="#" class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <i class="fas fa-users text-blue-500 mr-3"></i>
              Referral Code
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </a>
          <a href="#" class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <i class="fas fa-question-circle text-blue-500 mr-3"></i>
              FAQs
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </a>
          <a href="#" class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <i class="fas fa-book text-blue-500 mr-3"></i>
              Our Handbook
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </a>
          <a href="#" class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <i class="fas fa-users text-blue-500 mr-3"></i>
              Community
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </a>
          {/* <!-- Help Text --> */}
          <div class="flex items-center justify-between w-full mt-6 p-4 bg-blue-100 rounded-lg">
            <i class="fas fa-info-circle text-blue-500 mr-2"></i>
            <span class="flex-grow text-gray-800">
            <Link to="/dashboard">Back to Dashboard</Link> 
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
        {/* Add a Link to go back to the dashboard */}
        
      </div>
      
    // </div>
  );
};

export default UserProfile;