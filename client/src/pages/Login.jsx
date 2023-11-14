import React,{useEffect} from 'react';
import { db, auth } from '../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);

  // This effect will handle the redirection if the user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');  // If user is authenticated, redirect to dashboard
    }
  }, [user, navigate]);  // Dependencies in the dependency array

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 mt-8 text-center bg-white rounded-xl shadow-md w-80">
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Welcome</h1>
        <p className="text-gray-700 mb-4">Please sign in to continue</p>
        <button 
          className="px-4 py-2 text-white font-bold bg-blue-500 rounded-full w-full hover:bg-blue-700 transition-colors duration-200" 
          onClick={GoogleLogin}
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
