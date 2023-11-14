import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../firebase.js';
import Buttons from '../Buttons/Buttons';
import Timer from '../Timer/Timer';
import DisplayNum from '../DisplayNum/DisplayNum';
import UserBalance from '../Balance/UserBalance/UserBalance';
import SelectedNum from '../SelectedNum/SelectedNum';
import Wins from '../Wins/Wins';
import Payment from '../Payment/Payment.jsx';
import Withdraw from '../Withdraw/Withdraw.jsx';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import VibrationComponent from '../VibrationComponent/VibrationComponent.jsx';
import PhotoComponent from '../PhotoRecharge/PhotoRecharge.jsx';


const Game = () => {
  const [showDisplayNumBtnOff, setShowDisplayNumBtnOff] = useState(false);
  const [userEntries, setUserEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [finalArrResult, setFinalArrResult] = useState([]);
  const [win, setWin] = useState([]);
  const [lose, setLose] = useState([]);
  const [winLossStatus, setWinLossStatus] = useState(null);

  return (
    <div className="container 
                    mx-auto 
                    px-4 
                    py-8
                    rounded-none 
                    relative 
                    flex flex-col gap-6 items-center" 
                    style={{ maxWidth: '100%' }}>
    {/* <div className="flex flex-col gap-6 items-center relative"> */}
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
          setFinalArrResult={setFinalArrResult}
          setWinLossStatus={setWinLossStatus}
        />
        {/* <SelectedNum /> */}
        <UserBalance
          user={user}
          finalArrResult={finalArrResult}
        />
        <Buttons
          showDisplayNumBtnOff={showDisplayNumBtnOff}
          setUserEntries={setUserEntries}
        />
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
        {/* <Wins win={win} lose={lose} showResult={showResult} /> */}
        <div className="w-full flex justify-center">
      {/* <Payment user={user} /> */}
      <Link to="/recharge" className="bg-blue-500 text-white hover:text-gray-300 font-bold py-2 px-4 border rounded border-black hover:border-gray-300 transition duration-300">
  Recharge
</Link>
    </div>
    <Link to="/withdraw" className="text-white hover:text-gray-300 font-bold py-2 px-4 border rounded border-white hover:border-gray-300 transition duration-300">
      Go to Withdraw
    </Link>
        {/* <Withdraw userId={user} /> */}
      {/* </div> */}
    </div>
  );
};

export default React.memo(Game);