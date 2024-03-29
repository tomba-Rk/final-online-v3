import React, { useState,useEffect } from 'react';
import { auth,db } from '../../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { doc, onSnapshot,updateDoc  } from "firebase/firestore";
import axios from 'axios'; // Make sure to import axios at the top of your file

const UserProfile = () => {
  const [user, loading] = useAuthState(auth);
  const [referallink,setReferallink]=useState('');
  const [userBalanceShow, setUserBalanceShow] = useState(null);
  const [referralLinkVisible, setReferralLinkVisible] = useState(false);
  const [award, setAward] = useState(null);
  const [buttonEnabled, setButtonEnabled] = useState(false); // State to track if the button should be enabled
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userPhotoURL = user?.photoURL || 'default-profile-img-url';


 
  useEffect(() => {
    if (user && user?.uid) {
      const userRef =doc(db, "Customers", user?.uid);
        const unsubscribe = onSnapshot(userRef, (doc) => {
            let newInput = doc.data()?.referralLink;
            let newInputTwo = doc.data()?.userBalance;
            let newInputThree = doc.data()?.award;
        
            setReferallink(newInput);
            setUserBalanceShow(newInputTwo);
            setAward(newInputThree);

            if (doc.data()?.userBalance >= 200 && !doc.data()?.refer) {
              // Update the document to set referralLinkVisible to true
              updateDoc(userRef, {
                refer: true
              }).catch((error) => {
                console.error("Error updating document: ", error);
              });
              
            }  
            setReferralLinkVisible(doc.data()?.refer)        
      });
        
        // Clean up subscription on unmount
        return () => unsubscribe();
    }
}, [user,userBalanceShow]);

useEffect(() => {
  const rechargeUser = async () => {
    if (referralLinkVisible) {
      try {
        const userId = user?.uid; // Assuming `user.uid` holds the userId
        const amount = 200; // Example recharge amount, adjust as necessary
        
        const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/recharge`, {
          userId: userId,
          amount: amount,
        });
        
        // Assuming the API might return the updated referral link or some other data you need
       
        setError(''); // Reset error if the request is successful
        
        // If your API returns the updated referral link and you want to update it in your component
        // setReferralLink(response.data.referralLink);

      } catch (err) {
        setError('Failed to recharge.');
        console.error('Error recharging:', err);
      }
    }
  };

  rechargeUser();
}, [referralLinkVisible, user?.uid]);

const signOut = () => {
  auth.signOut().then(() => {
    navigate('/', { replace: true }); // If you have a separate login route
  });
};

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>; // Center loading text
  }
  const handleCopy=()=>{
    navigator.clipboard.writeText(referallink)
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <div className="flex flex-col items-center">
          <img className="h-24 w-24 rounded-full mb-4" src={userPhotoURL} alt="Profile " />
          <h2 className="text-xl font-semibold mb-1">{user?.displayName || 'User'}</h2>
          <div className="space-y-2 w-full">
            <div className=" block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
              <span>User Balance: {userBalanceShow}</span>
            </div>
            <div className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
              <span>Referral link:</span>    
            </div>
            {(!referralLinkVisible)&&(
            <div className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            <span> Recharge of Rs: 200 for referral link</span>
          </div>
            )}
            
            {(referralLinkVisible) && (
              <div className="flex items-center justify-between bg-blue-500 text-gray-800 py-3 px-4 rounded-lg mt-4 shadow">
              <div className="overflow-hidden overflow-ellipsis" style={{ maxWidth: "75%" }}>{referallink}</div>
              <button 
                className="ml-4 bg-gray-200 text-blue-800 hover:bg-blue-500 hover:text-white font-normal py-2 px-3 rounded transition duration-300 ease-in-out flex items-center"
                onClick={handleCopy}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M16 4h4v4m0 0h-4V4m4 0L14.5 9.5M18 20H5a2 2 0 01-2-2V7a2 2 0 012-2h4m5 5l4.5 4.5" />
                </svg>
                Copy
              </button>
            </div>
            )}
            
<div className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
              <span>Award: {award}</span>
            </div>
            <Link to="/rule" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Rule</Link>
            <Link to="/recharge" className="block text-center bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Recharge</Link>
            <Link to="/withdraw" className="block text-center bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Go to Withdraw</Link>
            
            <Link to="/dashboard" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Back to Dashboard</Link>
            
            
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default UserProfile;