import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail // Import this
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjJPT5uMq7_Y4ZSHTbRttEe2EhsujerWw",
  authDomain: "resume-analyzer-83c09.firebaseapp.com",
  projectId: "resume-analyzer-83c09",
  storageBucket: "resume-analyzer-83c09.appspot.com",
  messagingSenderId: "930470570164",
  appId: "1:930470570164:web:1d1e377815adebc1cf0fe1",
  measurementId: "G-150DTM3MX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail // Export this
};

// Function to log out the user
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};