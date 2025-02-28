// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB1JbXseUVGjRBTQ9coRYGEykymxuQ0lw",
  authDomain: "nusus-9dbf5.firebaseapp.com",
  projectId: "nusus-9dbf5",
  storageBucket: "nusus-9dbf5.firebasestorage.app",
  messagingSenderId: "847402241091",
  appId: "1:847402241091:web:156537d797dddf06ac58f6",
  measurementId: "G-81ZR0RM88F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("Hello", app);
