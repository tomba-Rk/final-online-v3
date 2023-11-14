import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../firebase.js';
import Modal from 'react-modal';
import { db } from '../../firebase.js';
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

const Buttons = ({ showDisplayNumBtnOff, setUserEntries }) => {
  const [user, loading] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counter, setCounter] = useState(1);
  const [selectedNum, setSelectedNum] = useState(null);
  const buttonArr = [1, 2, 3, 4, 5, 6];
  const ticketPrice = 10;

  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "Customers", user.uid);

      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserBalance(docSnapshot.data().userBalance);
        }
      });

      return () => {
        // Unsubscribe from the snapshot listener when the component unmounts
        unsubscribe();
      };
    }
  }, [user]);


  function incrementCounter() {
    setCounter(counter + 1);
  }

  function decrementCounter() {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  }

  const openModal = (e) => {
    setIsModalOpen(true);
    setSelectedNum(e);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function putTicket(e) {
    e.preventDefault();

    const totalCost = counter * ticketPrice;
    console.log(totalCost);
    console.log(userBalance);

    if (selectedNum === null) {
      alert('Please select a number before submitting.');
    } else if (totalCost > userBalance) {
      alert('Your input exceeds your balance!');
    } else {
      // Your code to process the ticket when conditions are met
      // Deduct the cost from the user's balance
      const newBalance = userBalance - totalCost;

      // Update the user's balance in Firestore
      const userRef = doc(db, "Customers", user.uid);
      await updateDoc(userRef, { userBalance: newBalance });

      // Add the selected tickets to the user's entries
      const numberToPush = selectedNum;
      const ticketsToAdd = Array.from({ length: counter }, () => numberToPush);

      // Update the user entries with the new tickets
      setUserEntries((userEntries) => [...userEntries, ...ticketsToAdd]);
    }

    // Close the modal
    setIsModalOpen(false);
  }

  // Additional button styling classes with hover effects and transition
  const buttonClasses = "bg-red-500 hover:bg-red-600 text-white p-6 rounded-none flex items-center justify-center text-4xl font-bold border-4 border-black transition duration-300 ease-in-out transform hover:scale-105";
  const modalButtonClasses = "px-6 py-3 bg-gray-700 text-white font-bold text-xl border-4 border-gray-600 rounded-none transition duration-300 ease-in-out transform hover:scale-110";
  const modalSubmitButtonClasses = "mt-4 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xl border-4 border-red-700 rounded-none transition duration-300 ease-in-out transform hover:scale-105";
  const modalCloseButtonClasses = "absolute top-0 right-0 mt-4 mr-4 bg-red-600 hover:bg-red-700 text-white font-bold p-3 border-2 border-red-700 rounded-none transition duration-300 ease-in-out transform hover:scale-110";

  return (
    <>
     <div className="flex flex-wrap justify-center items-center -mx-2">
      {buttonArr.map((el) => {
        return (
          <div className="w-1/3 px-2 mb-4 flex justify-center" key={el}>
            <button
              disabled={showDisplayNumBtnOff}
              className={buttonClasses}
              type="button"
              onClick={() => openModal(el)}
            >
              {el}
            </button>
          </div>
        );
      })}
    </div>
       <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="fixed inset-0 z-50 overflow-auto flex"
          overlayClassName="fixed inset-0 bg-black opacity-100" // Increased opacity to 90%
          appElement={document.getElementById('root') || document.createElement('div')}
        >

        <div className="relative p-8 bg-black w-full max-w-md m-auto flex-col flex rounded-none shadow-xl border-4 border-gray-700 text-white">
              <button
                onClick={closeModal}
                className={modalCloseButtonClasses}
              >
                X
              </button>
              <h3 className="text-3xl mb-6 font-bold">Choose a Number</h3>
              <div className="flex justify-center items-center space-x-4 mb-6">
                <button className={modalButtonClasses} onClick={decrementCounter}>-</button>
                <span className="text-2xl font-bold">{counter}</span>
                <button className={modalButtonClasses} onClick={incrementCounter}>+</button>
              </div>
              <button className={modalSubmitButtonClasses} onClick={putTicket}>Submit</button>
        </div>
      </Modal>
    </>
  );
}

export default Buttons;