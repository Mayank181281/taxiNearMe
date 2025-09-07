// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQqlBmu0ALFIujHfQa5aryXfbd9mVg2Jc",
  authDomain: "taxinearme-2025.firebaseapp.com",
  projectId: "taxinearme-2025",
  storageBucket: "taxinearme-2025.firebasestorage.app",
  messagingSenderId: "799457110370",
  appId: "1:799457110370:web:4a88fd9f3bb52be63e643b",
  measurementId: "G-CJ2LH9E1GL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, analytics, auth };
