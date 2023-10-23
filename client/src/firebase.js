// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtilH1r8v03Bdx6pLn_YOMm-ugjhJ9rx0",
  authDomain: "online-game-v1.firebaseapp.com",
  projectId: "online-game-v1",
  storageBucket: "online-game-v1.appspot.com",
  messagingSenderId: "427082120768",
  appId: "1:427082120768:web:d12c58ac85728cb39ae9a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db =  getFirestore(app);