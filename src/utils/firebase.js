import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjJPT5uMq7_Y4ZSHTbRttEe2EhsujerWw",
  authDomain: "resume-analyzer-83c09.firebaseapp.com",
  projectId: "resume-analyzer-83c09",
  storageBucket: "resume-analyzer-83c09.appspot.com",
  messagingSenderId: "930470570164",
  appId: "1:930470570164:web:1d1e377815adebc1cf0fe1",
  measurementId: "G-150DTM3MX9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
const analytics = getAnalytics(app);
const auth = getAuth(app);
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
};

// Function to log out the user
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};
