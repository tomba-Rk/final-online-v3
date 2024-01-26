import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../firebase.js';
import Modal from 'react-modal';
import { db } from '../../firebase.js';
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import svg1 from '../../assets/svg-v1.svg';
import svg2 from '../../assets/svg-v2.svg';
import svg3 from '../../assets/svg-v3.svg';
import svg4 from '../../assets/svg-v4.svg';
import svg5 from '../../assets/test-svg5.svg';
import svg6 from '../../assets/svg-6.svg';

// import svg12 from '../../assets/svg-v1.svg'



const Buttons = ({ btnOff, setUserEntries }) => {
  const [user, loading] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counter, setCounter] = useState(1);
  const [selectedNum, setSelectedNum] = useState(null);
  const buttonArr = [1, 2, 3, 4, 5, 6];
  const ticketPrice = 10;

  const [userBalance, setUserBalance] = useState(0);

  const buttonClasses = `bg-blue-800 text-white font-sans text-lg p-4 rounded-md border-none focus:outline-none disabled:opacity-50`;

  const svgArrObj=[
    {id:1,svg:svg1},
    {id:2,svg:svg2},
    {id:3,svg:svg3},
    {id:4,svg:svg4},
    {id:5,svg:svg5},
    {id:6,svg:svg6},
  ]
  const getSvgContentById = (id) => {
    const svgObj = svgArrObj.find((obj) => obj.id === id);
    return svgObj ? svgObj.svg : null;
  };
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
  // const buttonClasses = "bg-red-500 hover:bg-red-600 text-white p-6 rounded-none flex items-center justify-center text-4xl font-bold border-4 border-black transition duration-300 ease-in-out transform hover:scale-105";
  const modalButtonClasses = "px-6 py-3 bg-gray-700 text-white font-bold text-xl border-4 border-gray-600 rounded-none transition duration-300 ease-in-out transform hover:scale-110";
  const modalSubmitButtonClasses = "mt-4 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xl border-4 border-red-700 rounded-none transition duration-300 ease-in-out transform hover:scale-105";
  const modalCloseButtonClasses = "absolute top-0 right-0 mt-4 mr-4 bg-red-600 hover:bg-red-700 text-white font-bold p-3 border-2 border-red-700 rounded-none transition duration-300 ease-in-out transform hover:scale-110";
  
  return (
    <>
        <div className="grid grid-cols-3 gap-4 p-4 w-full">
          {buttonArr.map((el) => (
            // Each button will be a grid child, and the grid container takes care of spacing them into 3 columns
            <button
        key={el}
        disabled={btnOff}
        className="text-white font-sans text-5xl font-bold p-4 shadow border-none focus:outline-none disabled:opacity-50 flex items-center justify-center h-24 w-full bg-custom-green"
        style={{ borderRadius: '30%' }} // Inline style for 30% border-radius
        type="button"
        onClick={() => openModal(el)}
      >
         <img style={{
              width:"100px",
              height:"100px"
            }} src={getSvgContentById(el)} />
        
      </button>
          ))}
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