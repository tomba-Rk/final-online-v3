import React,{useEffect,useState} from 'react';
// import './UserBalance.css'
import { db } from '../../../firebase.js';
import { doc, onSnapshot} from "firebase/firestore";
import { Link } from 'react-router-dom';

const UserBalance = ({ user,finalArrResult }) => {
    const [userBalanceShow, setUserBalanceShow] = useState(null);
    const [showController, setShowController] = useState(false);

    useEffect(() => {
        if (user && user.uid) {
            const unsubscribe = onSnapshot(doc(db, "Customers", user.uid), (doc) => {
                let newInput = doc.data()?.userBalance;
                // console.log("Current data: ", newInput);
                // console.log("newInput type:", typeof (newInput));
                setUserBalanceShow(newInput);
                if (newInput <= 0) {
                    setShowController(true);
                    // console.log("first");
                } else {
                    setShowController(false);
                    // console.log("seconds");
                }
            });

            // Clean up subscription on unmount
            return () => unsubscribe();
        }
    }, [user]);

    
    // console.log("lenght ",finalArrResult.length);
    return (
        <>
          <div className="max-w-sm mx-auto">
            <div className="bg-white shadow-md rounded-lg p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Your Balance</h2>
                <span className="text-sm font-semibold bg-green-500 text-white py-1 px-3 rounded-full">Active</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">Rs: {userBalanceShow}</p>
              <div className="flex justify-between mt-6"> {/* Adjusted for better spacing */}
                <Link to="/recharge">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Add Balance
                  </button>
                </Link>
                {/* This div is used to provide flexible spacing */}
                <div className="flex-grow"></div>
                <Link to="/withdraw">
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    Withdraw
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      );
      
      
};

export default UserBalance;