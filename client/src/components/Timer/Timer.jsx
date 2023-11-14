import React, { useEffect, useState } from 'react';
import { useCountdown } from './useCountDown.jsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase.js';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import moment from 'moment';

const ExpiredNotice = () => {
  return (
    <div className="timer">
      <h1>timer</h1>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="timer-display">
      <span className="text-5xl font-bold">{minutes}</span>
      <span className="text-5xl font-bold">:</span>
      <span className="text-5xl font-bold">{seconds}</span>
    </div>
  );
};

const Timer = ({
  setShowDisplayNumBtnOff,
  setUserEntries,
  setWin,
  setLose,
  setShowResult,
  finalArrResult,
  winLossStatus,
  lose,
  win,
}) => {
  const [targetTime, setTargetTime] = useState('');
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const [user] = useAuthState(auth); // Added to get current user
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    onSnapshot(doc(db, 'RandomNumber', 'test'), (doc) => {
      try {
        const duration = doc.data().duration;
        if (duration && duration.toDate) {
          const newStr = moment(duration.toDate()).format();
          setTargetTime(newStr);
          setBalanceUpdated(false);
        } else {
          console.error('Invalid timestamp data:', doc.data().duration);
           // Set error state (optional)
        }
      } catch (err) {
        console.error('An error occurred:', err);
        // Set error state (optional)
      } finally {
        setLoading(false);  // Set loading to false once data is fetched or an error occurs
      }
    });
  }, []);

  const [days, hours, minutes, seconds] = useCountdown(targetTime);

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
          const increaseAmount = ((finalArrResult.length * 3) * 10); // Adjust as per your logic
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
  }, [minutes, seconds, user, balanceUpdated, win]);

  if (minutes === 0 && seconds < 5) {
    setUserEntries([]);
    setLose([]);
    setWin([]);
  }
  if (minutes === 0 && seconds < 10) {
    setShowResult(true);
  } else {
    setShowResult(false);
  }

  if ((minutes === 0 && seconds < 30) && (!loading)) {
    setShowDisplayNumBtnOff(true);
  } else {
    setShowDisplayNumBtnOff(false);
  }

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