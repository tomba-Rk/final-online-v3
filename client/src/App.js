import './App.css';
import {Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import PaymentSuccess from './components/Payment/PaymentSuccess';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/paymentsuccess" element={<PaymentSuccess/>}/>
      </Routes>
    </div>
   );
}

export default App;
