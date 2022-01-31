// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArw_yk45oB7BEG436ZTApdxyejZiiL-yo",
  authDomain: "dammo-internship-demo.firebaseapp.com",
  projectId: "dammo-internship-demo",
  storageBucket: "dammo-internship-demo.appspot.com",
  messagingSenderId: "938188258274",
  appId: "1:938188258274:web:5a3bf30f03ab71499f97bb",
  measurementId: "G-7CN2YC8YRR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
