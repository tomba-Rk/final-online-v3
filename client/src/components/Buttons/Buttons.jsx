import React,{useState,useEffect} from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../firebase.js';
// import './Buttons.css'
import Modal from 'react-modal';
import { db } from '../../firebase.js';
import { doc, getDoc,updateDoc,onSnapshot } from "firebase/firestore";

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

  return (
    <>
      <div className="btn__container">
        {buttonArr.map((el) => {
          return (
            <button
              key={el} // Add a key prop for React list rendering
              disabled={showDisplayNumBtnOff}
              className='btn-key'
              type="button"
              onClick={() => openModal(el)}
            >
              {el}
            </button>
          );
        })}
      </div>

      {selectedNum && (
        <div className="display__container">
          <p>You selected the number: {selectedNum}</p>
          <p>Current counter value: {counter}</p>
        </div>
      )}
      <Modal
        className="modal"
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={closeModal}
        appElement={document.getElementById('root')}
      >
        <h3>Im a Modal</h3>
        <p>You can close me</p>
        <div>
          <button onClick={incrementCounter}>+</button>
          {counter}
          <button onClick={decrementCounter}>-</button>
          <button onClick={putTicket}>Submit</button>
        </div>
      </Modal>
    </>
  );
}

export default Buttons;