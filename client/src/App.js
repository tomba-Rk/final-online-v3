import {Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Withdraw from './components/Withdraw/Withdraw';
import UserProfile from './components/UserProfile/UserProfile';
import PhotoRecharge from './components/PhotoRecharge/PhotoRecharge';

function App() {
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex-grow flex items-center justify-center w-full max-w-screen-md">
        <Routes>
          <Route index element={<Login/>}/>
          <Route path="/signup" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/withdraw" element={<Withdraw/>} />
          <Route path="/recharge" element={<PhotoRecharge/>} />
          <Route path="/userprofile" element={<UserProfile/>} />
        </Routes>
      </div>
    </div>
   );
}

export default App;