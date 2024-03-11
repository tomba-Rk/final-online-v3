import React from 'react';
import { Link } from 'react-router-dom';

const GameRule = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-center mb-4">Game Rules</h3>
        <div className="space-y-2 text-gray-700">
          <p>The minimum deposit required is Rs 200, and the referral link will be provided to you following your initial deposit.</p>
          <p>If any deposit you make is less than Rs 200, the money will be refunded to you.</p>
          <p>The game lasts for a duration of two minutes and repeats every two minutes.</p>
          <p>When the timer reaches 40 seconds, the button for selecting your lucky draw will be disabled.</p>
          <p>When it reaches 25 seconds, the 6 lucky draws will be displayed to you.</p>
          <p>When the timer reaches 20 seconds and your lucky draw appears more than once within that timeframe, you will be rewarded, resulting in an increase in your balance.</p>
          <p>The minimum balance required for withdrawing your money is Rs 500.</p>
        </div>
        <Link to="/dashboard" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default GameRule;
