import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.js';
import { doc, onSnapshot } from 'firebase/firestore';

const DisplayNum = ({
  showDisplayNumBtnOff,
  userEntries,
  showResult,
  finalArrResult,
  setFinalArrResult,
  setWinLossStatus,
  win,
  setWin,
  lose,
  setLose,
}) => {
  const [randomNum, setRandomNum] = useState([1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'RandomNumber', 'test'), (doc) => {
        const data = doc.data()?.data || [];
        setRandomNum(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const arrNew = Object.values(randomNum);
    const duplicates = arrNew.filter((value, index, self) => self.indexOf(value) !== index);

    const newFinalArrResult = duplicates.reduce((accumulator, duplicateValue) => {
        const matchingPrices = userEntries.filter((price) => price === duplicateValue);
        return accumulator.concat(matchingPrices);
    }, []);

    setFinalArrResult(newFinalArrResult);

    setWin(userEntries.filter((el) => newFinalArrResult.includes(el)));
    setLose(userEntries.filter((el) => !newFinalArrResult.includes(el)));
  }, [randomNum, userEntries]);

  console.log('finalArr', finalArrResult);
  console.log('win', win);
  console.log('loss', lose);

  return (
    <div className="displayNum__container flex flex-row justify-center text-center">
    {showDisplayNumBtnOff ? (
      Object.values(randomNum).map((el, index) => (
        <div key={index} className="displayNum-key text-4xl mx-2">
          {el}
        </div>
      ))
    ) : (
      <h1 className="text-4xl">Wait for your numbers</h1>
    )}
  </div>
  );
};

export default DisplayNum;