import React, { useState,useEffect } from 'react';
import { auth ,db } from '../../firebase'; // Import your Firebase initialization
import { doc, updateDoc,getDoc } from 'firebase/firestore';
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
    // Check if the user has enough balance to withdraw
    if (withdrawAmount > userBalance) {
      setMessage('Withdrawal amount exceeds your balance.');
      return false;
    }
    try {
      // Deduct the withdrawal amount from the user's current balance
      const updatedBalance = userBalance - withdrawAmount;

      // Update Firestore with the new balance and withdrawal information
      const userRef = doc(db, "Customers", user.uid);
      await updateDoc(userRef, {
        userBalance: updatedBalance,
        withdraw: withdrawAmount,
        GPaynumber: phoneNumber
      });

      // Update the local state to reflect the new balance
      setUserBalance(updatedBalance);
      return true;
    } catch (error) {
      console.error('Transaction failed: ', error);
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
    setMessage(result
      ? 'Withdrawal successful. Your balance has been updated.'
      : 'Failed to withdraw .Please check your withdrawal amount.'
    );
    // Reset fields after successful withdrawal
    if (result) {
      setAmount('');
      setNumber('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 w-full">
  <form className="p-6 mt-8 bg-white border-2 border-gray-300 shadow-none w-full max-w-2xl" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-mono text-gray-700">
          Amount:
        </label>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 bg-transparent border-2 border-gray-300 focus:border-blue-500 font-mono focus:outline-none"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-mono text-gray-700">
          GPay Number:
        </label>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 bg-transparent border-2 border-gray-300 focus:border-blue-500 font-mono focus:outline-none"
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </div>
      <button className="w-full px-4 py-2 text-gray-900 bg-gray-100 border-2 border-gray-300 font-mono hover:bg-gray-300 focus:outline-none" type="submit">
        Withdraw
      </button>
    </form>
    {message && <div className="mt-6 text-center font-mono">{message}</div>}
    <Link to="/dashboard" className="mt-4 text-lg px-6 py-2 bg-gray-900 text-white font-mono border border-gray-900 hover:bg-gray-700 transition-colors duration-300 w-full text-center">
      Back to Dashboard
    </Link>
  </div>
  );
};

export default Withdraw;