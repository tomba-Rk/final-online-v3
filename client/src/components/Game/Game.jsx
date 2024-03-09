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
  const [showDisplayNum, setShowDisplayNum] = useState(false);
  const [btnOff, setBtnOff] = useState(false);
  const [userEntries, setUserEntries] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [finalArrResult, setFinalArrResult] = useState([]);
  const [win, setWin] = useState([]);
  const [lose, setLose] = useState([]);
  const [winLossStatus, setWinLossStatus] = useState(null);

  return (
    <div className="flex flex-col space-y-4 md:space-y-8 lg:space-y-12">
      <div className="my-4 md:my-8 lg:my-12">
        <UserBalance
          user={user}
          finalArrResult={finalArrResult}
        />
      </div>
      <div className="my-4 md:my-8 lg:my-12">
        <Timer
          setShowDisplayNum={setShowDisplayNum}
          setBtnOff={setBtnOff}
          setUserEntries={setUserEntries}
          setShowResult={setShowResult}
          setWin={setWin}
          setLose={setLose}
          finalArrResult={finalArrResult}
          winLossStatus={winLossStatus}
          win={win}
          lose={lose}
        />
      </div>
      <div className="my-4 md:my-8 lg:my-12">
        <DisplayNum
          showDisplayNum={showDisplayNum}
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
      </div>
      <div className="my-4 md:my-8 lg:my-12">
        <Buttons
          btnOff={btnOff}
          setUserEntries={setUserEntries}
        />
      </div>
    </div>
  );
};

export default React.memo(Game);
