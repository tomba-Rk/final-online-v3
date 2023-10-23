import React from 'react';
import { db } from '../firebase.js';
import { auth } from '../firebase.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'Customers', result.user.uid);
      const userDoc = await getDoc(userRef);

      // Check if the user already exists in the database
      if (!userDoc.exists()) {
        // User doesn't exist, set user data including userBalance to 0
        await setDoc(userRef, {
          name: result.user.displayName,
          userBalance: 0,
        });
      }

      console.log(result.user);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={GoogleLogin}>Sign In</button>
    </div>
  );
};

export default Login;
