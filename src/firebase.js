// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "home-216b9.firebaseapp.com",
  projectId: "home-216b9",
  storageBucket: "home-216b9.appspot.com",
  messagingSenderId: "414281874661",
  appId: "1:414281874661:web:bb530da435f55e3381a80c",
  measurementId: "G-2YWE0TEJGC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
