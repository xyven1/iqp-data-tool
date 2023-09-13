// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA8aAc0NQoELFCT06DUkFRf96zH_Tp6834",
  authDomain: "iss-scooter-data-collection.firebaseapp.com",
  projectId: "iss-scooter-data-collection",
  storageBucket: "iss-scooter-data-collection.appspot.com",
  messagingSenderId: "846889115446",
  appId: "1:846889115446:web:5c6293497563193cd39d97",
  measurementId: "G-9KXL28GDL7",
  databaseURL:
    "https://iss-scooter-data-collection-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getDatabase(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
