import React,{useEffect,useState} from 'react';
// import './UserBalance.css'
import { db } from '../../../firebase.js';
import { doc, onSnapshot} from "firebase/firestore";

const UserBalance = ({ user,finalArrResult }) => {
    const [userBalanceShow, setUserBalanceShow] = useState(null);
    const [showController, setShowController] = useState(false);

    useEffect(() => {
        if (user && user.uid) {
            const unsubscribe = onSnapshot(doc(db, "Customers", user.uid), (doc) => {
                let newInput = doc.data()?.userBalance;
                console.log("Current data: ", newInput);
                console.log("newInput type:", typeof (newInput));
                setUserBalanceShow(newInput);
                if (newInput <= 0) {
                    setShowController(true);
                    console.log("first");
                } else {
                    setShowController(false);
                    console.log("seconds");
                }
            });

            // Clean up subscription on unmount
            return () => unsubscribe();
        }
    }, [user]);

    
    console.log("lenght ",finalArrResult.length);
    return (
        <div className="user-balance-container bg-gray-800 p-4 rounded-lg shadow-md max-w-xs mx-auto">
        <div className="flex flex-col justify-between mb-4">
          <div className="mb-2" style={{ width: '300px' }}>
            <p className="user-balance-title text-gray-400 text-sm">Total Balance</p>
            <h1 className="text-2xl font-bold text-white">${userBalanceShow}</h1>
          </div>
          {/* <div className="bg-gray-700 text-xs font-medium p-2 rounded-lg">
            <p className="text-green-500">+ $249.41 (5.40%)</p>
            <p className="text-gray-400">vs. previous week (20-27th Sep)</p>
          </div> */}
        </div>

        {showController && (
          <div className="bg-gray-700 text-xs font-medium p-2 rounded-lg">
          <p className="text-green-500"></p>
          <p className="text-gray-400">Recharge your balance</p>
        </div>
        )}
      </div>
      
    );
};

export default UserBalance;