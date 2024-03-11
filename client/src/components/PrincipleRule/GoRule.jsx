import React from 'react';
import { Link } from 'react-router-dom';

const GoRule = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <div className="space-y-2 w-full">
          <Link to="/game" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Game Rule</Link>
          <Link to="/reward" className="block text-center bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Reward Rule</Link>
          <Link to="/refer" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Refer Rule</Link>
          <Link to="/dashboard" className="block text-center bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default GoRule;
