// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 Add Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBUhccYUdLPH1ERnNyh9BGz0qYXoil3lmk",
  authDomain: "cybercode-edulabs.firebaseapp.com",
  projectId: "cybercode-edulabs",
  storageBucket: "cybercode-edulabs.firebasestorage.app",
  messagingSenderId: "820167153224",
  appId: "1:820167153224:web:ff15d0549bb4bdf1e32a7d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // 👈 Initialize Firestore

export { auth, provider, db }; // 👈 Export Firestore
