
import { auth } from '../firebase.js';
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from 'react-router-dom';
import Game from '../components/Game/Game.jsx';

export default function Dashboard() {
  const route = useNavigate();
  const [user, loading] = useAuthState(auth);
  console.log(user);
  if (loading) return <h1>Loading</h1>;
  if (!user) route("/");
  if (user)
    return (
      <div>
        <h1>Welcome to your dashboard {user.displayName}</h1>
            <Game/>
        <button className="signOut-btn" onClick={() => auth.signOut()}>Sign out</button>
      </div>
    );
}