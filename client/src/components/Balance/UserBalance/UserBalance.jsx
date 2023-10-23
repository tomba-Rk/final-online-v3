import React,{useEffect,useState} from 'react';
import './UserBalance.css'
import { db } from '../../../firebase.js';
import { doc, onSnapshot,collection } from "firebase/firestore";

const UserBalance = ({ user,finalArrResult }) => {
    const [userBalanceShow, setUserBalanceShow] = useState(null);
    const [showController, setShowController] = useState(false);

    useEffect(() => {
        if (user && user.uid) {
            const unsubscribe = onSnapshot(doc(db, "Customers", user.uid), (doc) => {
                let newInput = doc.data().userBalance;
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
        <div>
            <h3>User Balance: {userBalanceShow}</h3>
            {showController && (
                <div>
                    {/* Whatever content you want to show when balance <= 0 */}
                    <p>Your balance is zero or negative. Please top-up!</p>
                </div>
            )}
        </div>
    );
};

export default UserBalance;
