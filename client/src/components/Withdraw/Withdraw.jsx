import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase'; // Ensure correct import paths
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';

const Withdraw = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [user] = useAuthState(auth);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "Customers", user.uid);
      getDoc(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUserBalance(snapshot.data().userBalance);
        }
      });
    }
  }, [user]);

  const updateUserBalanceInFirestore = async (withdrawAmount, phoneNumber) => {
    if (withdrawAmount > userBalance) {
      setMessage('Withdrawal amount exceeds your balance.');
      return false;
    }
    
    const userRef = doc(db, "Customers", user.uid);
  
    try {
      // Fetch the current document to get the current withdraw value
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        // Get the current withdraw value, default to 0 if it doesn't exist
        const currentWithdraw = docSnap.data().withdraw || 0;
        // Calculate the new withdraw total
        const newWithdrawTotal = currentWithdraw + withdrawAmount;
  
        // Calculate the updated balance
        const updatedBalance = userBalance - withdrawAmount;
  
        // Update Firestore with the new balance and new withdraw total
        await updateDoc(userRef, {
          userBalance: updatedBalance,
          withdraw: newWithdrawTotal,
          GPaynumber: phoneNumber
        });
  
        // Update local state to reflect the new balance
        setUserBalance(updatedBalance);
        setMessage('Withdrawal successful. Your balance has been updated.');
      } else {
        console.log("No such document!");
      }
      return true;
    } catch (error) {
      console.error('Transaction failed: ', error);
      setMessage('Failed to withdraw. Please check your withdrawal amount.');
      return false;
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const withdrawAmount = Number(amount);
    if (withdrawAmount <= 0) {
      setMessage('Please enter a positive amount to withdraw.');
      return;
    }
    const result = await updateUserBalanceInFirestore(withdrawAmount, number);
    setMessage(result ? 'Pending !! Balance will be updated' : 'Failed to withdraw. Please check your withdrawal amount.');
    if (result) {
      setAmount('');
      setNumber('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <form className="p-6 mt-8 bg-white rounded-3xl shadow-xl max-w-md w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-normal text-gray-700">
            Amount:
          </label>
          <input className="w-full px-3 py-2 leading-tight text-gray-700 bg-transparent border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-normal text-gray-700">
            GPay or Paytm Number:
          </label>
          <input className="w-full px-3 py-2 leading-tight text-gray-700 bg-transparent border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" value={number} onChange={(e) => setNumber(e.target.value)} required />
        </div>
        <button className="w-full px-4 py-2 text-blue-700 bg-blue-100 border border-blue-700 rounded hover:bg-blue-200 focus:outline-none transition duration-300" type="submit">
          Withdraw
        </button>
      </form>
      {message && <div className="mt-6 text-center text-sm font-normal">{message}</div>}
      <Link to="/dashboard" className="mt-4 text-lg px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 w-full text-center">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Withdraw;
