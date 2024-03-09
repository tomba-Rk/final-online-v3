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
  
  

  if (user)
    return (
      <div className="flex flex-col h-screen">
        <Navbar user={user}/>
        <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-custom-purple to-custom-purple">
          <div className="text-center">
            <Game  />
          </div>
        </div>
      </div>
    );

  // If for some reason neither loading/user state is true, return null or render something else
  return null;
}