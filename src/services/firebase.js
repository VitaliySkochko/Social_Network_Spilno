import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAJXRaAotxgGrozYl9Djys_7FQw7GNl2xM",
  authDomain: "social-network-spilno.firebaseapp.com",
  projectId: "social-network-spilno",
  storageBucket: "bigsports-a911c.appspot.com",
  messagingSenderId: "1093598156823",
  appId: "1:1093598156823:web:4e8b837a72a8cc39eb6452",
  measurementId: "G-9GX0X8G7N8"
};


const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const storage = getStorage(app); 
export const auth = getAuth(app);
export const db = getFirestore(app);