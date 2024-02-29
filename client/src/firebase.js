// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-bd0b3.firebaseapp.com",
  projectId: "real-estate-bd0b3",
  storageBucket: "real-estate-bd0b3.appspot.com",
  messagingSenderId: "162216602202",
  appId: "1:162216602202:web:23b26b1a2df7864ba8c663",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
