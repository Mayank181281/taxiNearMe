// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDQqlBmu0ALFIujHfQa5aryXfbd9mVg2Jc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "taxinearme-2025.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "taxinearme-2025",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "taxinearme-2025.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "799457110370",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:799457110370:web:4a88fd9f3bb52be63e643b",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-CJ2LH9E1GL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;