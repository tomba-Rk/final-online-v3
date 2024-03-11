import React, { useEffect, useState } from 'react';
import { useCountdown } from './useCountDown.jsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase.js';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
// import moment from 'moment';

// Importing date-fns for consistent date handling
import { parseISO } from 'date-fns';


const ExpiredNotice = () => {
  return (
    <div className="timer flex items-center justify-center bg-purple-700 p-4 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-white">Next Round</h1>
    </div>

  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {

  const safeMinutes=Number(minutes) || 0;
  const safeSeconds=Number(seconds) || 0;
  return (
    <div className="timer-display flex items-center justify-center bg-purple-700 p-4 rounded-lg shadow-xl">
      <span className="text-5xl font-bold text-white">{safeMinutes}</span>
      <span className="text-5xl font-bold text-gray-300 mx-2">:</span>
      <span className="text-5xl font-bold text-white">{safeSeconds}</span>
    </div>
  );
  
  
  
};

const Timer = ({
  setShowDisplayNum,
  setBtnOff,
  setUserEntries,
  setWin,
  setLose,
  setShowResult,
  finalArrResult,
  winLossStatus,
  lose,
  win,
}) => {
  // const [targetTime, setTargetTime] = useState('');
  const [expirationTime, setExpirationTime] = useState('');
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const [user] = useAuthState(auth); // Added to get current user
  const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
    setUserEntries([]);
    setLose([]);
    setWin([]);
  },[])

  
  useEffect(() => {
    onSnapshot(doc(db, 'RandomNumber', 'test'), (doc) => {
      try {
        // Fetching expirationTime instead of duration
        const fetchedExpirationTime = doc.data().expirationTime;
    
        if (fetchedExpirationTime) {
          setExpirationTime(fetchedExpirationTime);
          setBalanceUpdated(false);
        } else {
          console.error('Invalid timestamp data:now', doc.data().expirationTime);
           // Set error state (optional)
        }
      } catch (err) {
        console.error('An error occurred:', err);
        // Set error state (optional)
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const [days, hours, minutes, seconds] = useCountdown(parseISO(expirationTime)); // Parsing the ISO string

  useEffect(() => {
    if (
      minutes === 0 &&
      seconds <= 20 &&
      win.length > 0 &&
      user &&
      !balanceUpdated
    ) {
      // logic for handling the user's winnings
      const userRef = doc(db, 'Customers', user.uid);

      getDoc(userRef)
        .then((snapshot) => {
          const currentBalance = snapshot.data().userBalance || 0;
          const increaseAmount = (finalArrResult.length * 10); // Adjust as per your logic
          const updatedBalance = currentBalance + increaseAmount;

          return updateDoc(userRef, { userBalance: updatedBalance });
        })
        .then(() => {
          setBalanceUpdated(true);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [minutes, seconds, user, balanceUpdated]);

  // Reset entries, wins, and losses
  useEffect(() => {
    if (minutes === 0 && seconds < 20) {
      setUserEntries([]);
      setLose([]);
      setWin([]);
      
    }
  }, [minutes, seconds, setUserEntries, setLose, setWin]);

  

   // Show or hide result
  // useEffect(() => {
  //   setShowResult((minutes === 0 && seconds < 10) && !loading && !isNaN(minutes) && !isNaN(seconds));
  // }, [minutes, seconds, loading, setShowResult]);


  // Enable or disable button
  useEffect(() => {
    setBtnOff((minutes === 0 && seconds < 40) && !loading && !isNaN(minutes) && !isNaN(seconds));
  }, [minutes, seconds, loading, setBtnOff]);

  useEffect(() => {
    // Ensure this logic runs only when specific dependencies change
    if ((minutes === 0 && seconds < 25 && seconds !== 0 && seconds !== 1) && (!loading) && (!isNaN(minutes)) && (!isNaN(seconds))) {
      setShowDisplayNum(true);
    } else {
      setShowDisplayNum(false);
    }
  
    // Replicate for other state updates (setBtnOff, setShowResult, etc.)
  }, [minutes, seconds, loading]); // Add other dependencies as needed
  

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <div className="timer-container">
        <ShowCounter days={days} hours={hours} minutes={minutes} seconds={seconds} />
      </div>
    );
  }
};

export default Timer;