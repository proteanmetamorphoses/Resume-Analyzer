/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "../utils/firebase";
import { Link } from "react-router-dom";
import "./Login.css";
import googleLogo from "./GoogleG.png";
import HexagonBackground from "./HexagonBackground";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase"; // Make sure to import your Firestore instance
import { useAuth } from './AuthContext';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserRole } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRole = await fetchUserRole(userCredential.user.uid);
      // Use the hook to set the user role
      setUserRole(userRole);
      sessionStorage.setItem('userRole', userRole);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while trying to log in. Please try again.");
    }
  };


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if the user exists in Firestore and fetch their role
      const userRole = await fetchUserRole(user.uid);
  
      // If user does not exist in Firestore (i.e., new Google user), create a new entry
      if (!userRole) {
        await createNewUserWithRole(user.uid, user.email); // Implement this function
      }
  
      // Set the user role in global context
      setUserRole(userRole || 'user'); // Replace 'default-role' with your default role
  
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setError("There was an issue with Google sign-in. Please try again.");
    }
  };

  const fetchUserRole = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data().role; // Assuming 'role' is the field where the role is stored
      } else {
        // Handle the case where user data does not exist
        console.log("No such user!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  const createNewUserWithRole = async (userId, userEmail) => {
    try {
      await setDoc(doc(db, "users", userId), {
        email: userEmail,
        role: "user" // Replace with your default role
      });
    } catch (error) {
      console.error("Error creating new user:", error);
    }
  };
  
  return (
    <div className="login-container">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <h1 className="header-title">Advanced Resume</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <button className="login-button" type="submit">
            Login
          </button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleGoogleSignIn} className="google-sign-in-button">
        <img src={googleLogo} alt="Google sign-in" />
        Sign in with Google
      </button>
      <p className = ".noAccount">
        Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
      </p>
      <p className = ".forgotPWD">
        Forgot your password? <Link to="/password-reset" className="pwReset-link">Reset it here</Link>
      </p>
    </div>
  );
}
export default Login;
