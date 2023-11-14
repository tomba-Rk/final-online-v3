import { useEffect } from 'react';
import { auth } from '../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import Game from '../components/Game/Game.jsx';
import Navbar from '../components/Navbar/Navbar.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  // Prevent going back after signing out by replacing the history entry
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true }); // Replace the history entry so the user cannot navigate back
    }
  }, [user, navigate]);

  if (loading) return <h1>Loading...</h1>;
  
  // SignOut function to log the user out and navigate to the home page
  const signOut = () => {
    auth.signOut().then(() => {
      navigate('/', { replace: true }); // If you have a separate login route
    });
  };

  if (user)
    return (
      <div className="flex flex-col h-screen">
        <Navbar user={user}/>
        <div className="flex-grow flex items-center justify-center  bg-gradient-to-r 
                    from-green-400 to-blue-500 ">
          <div className="text-center">
            <Game  />

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

  // If for some reason neither loading/user state is true, return null or render something else
  return null;
}