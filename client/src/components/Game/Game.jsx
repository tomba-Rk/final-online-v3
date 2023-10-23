import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../firebase.js';
import './Game.css';
import Buttons from '../Buttons/Buttons';
import Timer from '../Timer/Timer';
import DisplayNum from '../DisplayNum/DisplayNum';
import UserBalance from '../Balance/UserBalance/UserBalance';
import SelectedNum from '../SelectedNum/SelectedNum';
import Wins from '../Wins/Wins';
import Payment from '../Payment/Payment.jsx';


const Game = () => {
  const [showDisplayNumBtnOff, setShowDisplayNumBtnOff] = useState(false);
  const [userEntries, setUserEntries] = useState([]);
  //state for showing the win or lose output to the ui after 10 seconds
  const [showResult,setShowResult]=useState(false);
  const [user, loading] = useAuthState(auth);
  const [finalArrResult, setFinalArrResult] = useState([]);
  const [win,setWin]=useState([]);
  const [lose,setLose]=useState([]);
  const [winLossStatus, setWinLossStatus] = useState(null);


  
  console.log('userEntries', userEntries);

  return (
    <>
    <div className='container'>
      <h1>Game Container</h1>
      <DisplayNum 
          showDisplayNumBtnOff={showDisplayNumBtnOff} 
          userEntries={userEntries} 
          win={win}
          lose={lose}
          setWin={setWin}
          setLose={setLose}
          setShowResult={setShowResult}
          showResult={showResult}
          finalArrResult={finalArrResult}
          setFinalArrResult={ setFinalArrResult}
          setWinLossStatus={setWinLossStatus}
          />
      <SelectedNum />
      <Timer 
          setShowDisplayNumBtnOff={setShowDisplayNumBtnOff} 
          setUserEntries={setUserEntries}  
          setShowResult={setShowResult}
          setWin={setWin} 
          setLose={setLose} 
          finalArrResult={finalArrResult}
          winLossStatus={winLossStatus}
          win={win}
          lose={lose}
          />
      <UserBalance 
          user={user}
          finalArrResult={finalArrResult}
          />
      
      <Buttons 
          showDisplayNumBtnOff={showDisplayNumBtnOff} 
          setUserEntries={setUserEntries}
          />
    </div>
    <Wins win={win} lose={lose} showResult={showResult}/>
    <Payment user={user}/>
  </>
  );
};

export default React.memo(Game);
