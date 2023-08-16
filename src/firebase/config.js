// Import the functions you need from the SDKs you need
import { getStorage } from "firebase/storage";
import 'firebase/storage'
import 'firebase/firestore'
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrWuvVTmSq8zggFKCI0K7Laz4c648Qv9Q",
  authDomain: "photofolio-4ca74.firebaseapp.com",
  projectId: "photofolio-4ca74",
  storageBucket: "photofolio-4ca74.appspot.com",
  messagingSenderId: "924353569946",
  appId: "1:924353569946:web:0bfa26e23fa258080bab23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage=getStorage();
const db = getFirestore(app);
export {storage, db};