import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.js';
import { doc, onSnapshot } from 'firebase/firestore';
import svg1 from '../../assets/svg-v1.svg';
import svg2 from '../../assets/svg-v2.svg';
import svg3 from '../../assets/svg-v3.svg';
import svg4 from '../../assets/svg-v4.svg';
import svg5 from '../../assets/test-svg5.svg';
import svg6 from '../../assets/svg-6.svg';

const DisplayNum = ({
  showDisplayNum,
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

  const svgArrObj=[
    {id:1,svg:svg1},
    {id:2,svg:svg2},
    {id:3,svg:svg3},
    {id:4,svg:svg4},
    {id:5,svg:svg5},
    {id:6,svg:svg6},
  ]

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

    const newSet =new Set(duplicates);
    
   
    
    const convertedArr= [...newSet]
    let newFilter=[]
    let array1=[]
    convertedArr.forEach((num)=>{
      
        newFilter=arrNew.filter((el)=>{
        return num === el
    })
    for(let i = 0; i < newFilter.length; i++) {
        array1.push(newFilter[i])
      }
    })
    const newFinalArrResult = array1.reduce((accumulator, duplicateValue) => {
        const matchingPrices = userEntries.filter((price) => price === duplicateValue);
        return accumulator.concat(matchingPrices);
    }, []);

    
  

    const winningArray =  newFinalArrResult.concat(userEntries.filter((el) => newFinalArrResult.includes(el)));
    setFinalArrResult(winningArray);

    setWin(userEntries.filter((el) => newFinalArrResult.includes(el)));
    setLose(userEntries.filter((el) => !newFinalArrResult.includes(el)));
  }, [randomNum, userEntries]);

  

  const getSvgContentById = (id) => {
    const svgObj = svgArrObj.find((obj) => obj.id === id);
    return svgObj ? svgObj.svg : null;
  };

  return (
    <div className="displayNum__container flex flex-row justify-center text-center bg-purple-700 py-4 px-8 rounded-lg shadow-xl">
  {showDisplayNum ? (
    Object.values(randomNum).map((el, index) => (
      <div key={index} className="displayNum-key flex items-center justify-center text-4xl mx-0.5 text-white">
      <span className="inline-flex items-center justify-center p-1 bg-white rounded-full shadow-md">
        <img className="w-12 h-12" src={getSvgContentById(el)} alt="Number"/>
      </span>        
    </div>
    
    ))
  ) : (
    <h1 className="text-4xl font-bold text-white">Your Luck is on the Way</h1>
  )}
</div>

  );
};

export default DisplayNum;