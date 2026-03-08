// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCRIxbu7L47ERfQKIeBYy3ScpyDIIMOrlg",
  authDomain: "collaborativespreadsheet-31771.firebaseapp.com",
  projectId: "collaborativespreadsheet-31771",
  storageBucket: "collaborativespreadsheet-31771.firebasestorage.app",
  messagingSenderId: "332003997436",
  appId: "1:332003997436:web:1a1a8977e201f6de49c979",
  measurementId: "G-Q8DP5NT4WF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();