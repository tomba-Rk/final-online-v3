import React from 'react';
import { Link } from 'react-router-dom';

const ReferralRule = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-center mb-4">Referral Rules</h3>
        <ul className="space-y-2 text-gray-700 list-disc pl-5">
          <li>For every user you refer using the referral link, you will receive a reward of 50 if that user makes a deposit.</li>
        </ul>
        <Link to="/dashboard" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Back to Dashboard</Link>
      </div>
    </div>
  )
}

export default ReferralRule;
