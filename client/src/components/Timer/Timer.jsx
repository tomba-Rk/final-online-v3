import React, { useEffect, useState }  from 'react'
// import './Timer.css';
import  {useCountdown}  from './useCountDown.jsx'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db } from '../../firebase.js';
import { doc, updateDoc,getDoc, onSnapshot } from "firebase/firestore";
import moment from 'moment';


const ExpiredNotice = () => {
  return (
    <div className="timer">
      <span>Expired!!!</span>
      <p>Please select a future date and time.</p>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
   
    if(minutes===0 && seconds<3){
    }
    else{

    }

  
  return (
    <div className="timer-display">
      <span>{minutes}</span>
      <span>:</span>
      <span>{seconds}</span>
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
    win
  }) => {
  const [targetTime,setTargetTime]=useState("");
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const [user] = useAuthState(auth); // Added to get current user
  useEffect(() => {
    onSnapshot(doc(db, "RandomNumber", "test"), (doc) => {
        //time
        const duration = doc.data().duration;
        if (duration && duration.toDate) {
            const newStr = moment(duration.toDate()).format();
            setTargetTime(newStr);

            // Reset the balanceUpdated flag when the targetTime changes
            setBalanceUpdated(false);
        } else {
            console.error('Invalid timestamp data:', doc.data().duration);
        }
    });
}, []);


  // console.log(targetTime);
 
  const [days, hours, minutes, seconds] = useCountdown(targetTime);
  // console.log(seconds);
  // console.log("finalResult",finalArrResult);
  // Logic to update user balance after 10 seconds
   // Logic to update user balance after 10 seconds
    // Added win and lose as dependencies
  //   useEffect(() => {
  //     if (minutes === 0 && seconds <= 20 && lose.length > 0 && user && !balanceUpdated) {
  //         // logic for handling the user's losses
  //         const userRef = doc(db, "Customers", user.uid);
  
  //         getDoc(userRef)
  //             .then(snapshot => {
  //                 const currentBalance = snapshot.data().userBalance || 0;
  //                 const decreaseAmount = lose.length * 10; // Adjust as per your logic
  //                 const updatedBalance = currentBalance - decreaseAmount;
  
  //                 return updateDoc(userRef, { userBalance: updatedBalance });
  //             })
  //             .then(() => {
  //                 setBalanceUpdated(true);
  //             })
  //             .catch(error => {
  //                 console.error("Error:", error);
  //             });
  //     }
  // }, [minutes, seconds, user, balanceUpdated, lose]);
  
  useEffect(() => {
    if (minutes === 0 && seconds <= 20 && win.length > 0 && user && !balanceUpdated) {
        // logic for handling the user's winnings
        const userRef = doc(db, "Customers", user.uid);

        getDoc(userRef)
            .then(snapshot => {
                const currentBalance = snapshot.data().userBalance || 0;
                const increaseAmount = win.length * 10.3; // Adjust as per your logic
                const updatedBalance = currentBalance + increaseAmount;

                return updateDoc(userRef, { userBalance: updatedBalance });
            })
            .then(() => {
                setBalanceUpdated(true);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
}, [minutes, seconds, user, balanceUpdated, win]);




  
  //logic for displaying randomly generated number after 30 seconds

  if(minutes===0 && seconds<5){
    setUserEntries([])
    setLose([])
    setWin([])
   
  }
  if(minutes===0 && seconds<10){
    setShowResult(true)
    
  }else{
    setShowResult(false)
  }
  
  
  if(minutes===0 && seconds<30){
    setShowDisplayNumBtnOff(true)
  }else{
    setShowDisplayNumBtnOff(false);
  }
  

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <div className="timer">
        <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
      </div>
      
    );
  }
};

export default Timer;