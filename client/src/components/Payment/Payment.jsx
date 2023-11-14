import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../../firebase.js';

const Payment = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [amount,setAmount] = useState(0)

  const userId = user.uid;
  const notify = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const verifyPaymentWithServer = async (amount) => {
    const response = await axios.post("https://final-project-online-v4.onrender.com/api/paymentverification", { amount });
    if (response.data && response.data.success) {
      return true;
    }
    console.error("Invalid response from the server:", response);
    return false;
  };

  const updateUserBalanceInFirestore = async (userId, amount) => {
    const userRef = db.collection("Customers").doc(userId); // Assuming you've initialized Firebase's Firestore elsewhere
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const currentBalance = userDoc.data().userBalance || 0;
      const newBalance = currentBalance + amount;
      await userRef.update({ userBalance: newBalance });
      return true;
    }
    return false;
  };

  const onPaymentSuccess = async (amount) => {
    console.log("Payment successful. Updating user balance in Firestore...");
    if (await verifyPaymentWithServer(amount)) {
      if (await updateUserBalanceInFirestore(user.uid, amount)) {
        notify("Payment successful!", "success");
      } else {
        notify("Error: User not found in Firestore", "error");
      }
    } else {
      notify("Error: Invalid server response", "error");
    }
  };

  const handlePayment = async (amount) => {
    setLoading(true);
    try {
      const { data: { key } } = await axios.get("https://final-project-online-v4.onrender.com/api/getKey");
      const response = await axios.post("https://final-project-online-v4.onrender.com/api/create-order", { amount });
  
      if (response.data && response.data.order) {
        const order = response.data.order;
        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "Aarke",
          description: "Tutorial of RazorPay",
          image: "https://avatars.githubusercontent.com/u/25058652?v=4",
          order_id: order.id,
          callback_url: `https://final-project-online-v4.onrender.com/api/paymentverification?user_uid=${userId}`,
          prefill: {
            name: user.displayName, // Use user's display name
            email: user.email, // Use user's email
            contact: user.phoneNumber // Use user's phone number
          },
          notes: {
            "address": "Razorpay Corporate Office"
          },
          theme: {
            "color": "#121212"
          }
        };
  
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.success', () => {
          onPaymentSuccess(amount);
        });
        razorpay.open();
      } else {
        console.error("Invalid response from the server:", response);
        alert("Error: Invalid server response");
      }
    } catch (error) {
      console.error("Error during Razorpay payment:", error);
      alert("Error: Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="w-full max-w-xs">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="appearance-none block w-full bg-white text-black border-4 border-black rounded-none py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-yellow-500"
        />
        <button
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-none"
          onClick={() => handlePayment(amount)}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </div>

  );
};

export default Payment;