import React from 'react';
import { Link } from 'react-router-dom';

const RewardRule = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-center mb-4">Reward Rules</h3>
        <ul className="space-y-2 text-gray-700 list-disc pl-5">
          <li>If your chosen draw or number appears only once, you will not receive a reward.</li>
          <li>If your chosen draw or number appears twice, you will receive a reward equal to twice your initial amount, in addition to the initial amount itself.</li>
          <li>If your chosen draw or number appears three times, you will be rewarded with three times your initial amount, plus the initial amount itself.</li>
          <li>If your chosen draw or number appears three times, you will be rewarded with four times your initial amount, plus the initial amount itself.</li>
          <li>If your chosen draw or number appears three times, you will be rewarded with five times your initial amount, plus the initial amount itself.</li>
          <li>If your chosen draw or number appears three times, you will be rewarded with six times your initial amount, plus the initial amount itself.</li>
        </ul>  
        <Link to="/dashboard" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Back to Dashboard</Link> 
      </div>
    </div>
  );
}

export default RewardRule;
