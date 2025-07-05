
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgsaXPXOT-zEaSxKRP_Ngi4MPYG714wCI",
  authDomain: "catfishcare.firebaseapp.com",
  projectId: "catfishcare",
  storageBucket: "catfishcare.appspot.com",
  messagingSenderId: "368686590653",
  appId: "1:368686590653:web:a8415f29032f06dd6365d4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
