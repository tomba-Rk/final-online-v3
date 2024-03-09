import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import backgroundImage from '../images/cover-page-lagw.png';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const googleProvider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);
  // const [referralLink, setReferralLink] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const getReferralIdFromUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('ref');
  };

  const generateReferralLink = async (userId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/create-referral`, { userId: userId,origin: window.location.origin });
      // setReferralLink(response.data.referralLink);
      console.log(response.data.referralLink);
      setError('');
      return response.data.referralLink; // Return the referral link
    } catch (err) {
      setError('Failed to create referral link.');
      console.error('Error creating referral link:', err);
    }
  };
  
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'Customers', result.user.uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        //generate the referral link
        const referralLink = await generateReferralLink(result.user.uid);
        // New user, set user data and check for referral
        console.log(typeof(referralLink))
        await setDoc(userRef, {
          name: result.user.displayName,
          userBalance: 0,
          referralLink: referralLink || "" ,
          recharge:0,
          award:0
  
        });
  
        const referralId = getReferralIdFromUrl();
        if (referralId) {
          // Send referral ID to backend for verification
          const verifyResponse = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/verifyReferral`, {
            newUser: result.user.uid,
            referralId: referralId
          });
          console.log("Referral verification response:", verifyResponse.data);
        }
      }
  
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="p-6 mt-8 text-center bg-white bg-opacity-60 rounded-xl shadow-lg" style={{ width: '450px', backdropFilter: 'blur(10px)' }}>
  <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SixDraw</h1>
  <p className="text-lg text-gray-600 mb-6">Please sign in to continue</p>
  <button
    className="px-6 py-3 text-lg text-white font-bold bg-blue-600 rounded-full w-full hover:bg-blue-800 transition-colors duration-300 ease-in-out shadow hover:shadow-xl"
    onClick={GoogleLogin}
  >
    Sign In with Google
  </button>
</div>


    </div>
  );
};

export default Login;
