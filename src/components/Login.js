/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
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
import { TokenContext } from "./tokenContext"; // import TokenContext

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const { tokens } = useContext(TokenContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRole = await fetchUserRole(userCredential.user.uid);
      // Use the hook to set the user role
      setUserRole(userRole);
      sessionStorage.setItem('userRole', userRole);
      const redirectPath = tokens > 0 ? "/purchase" : "/menu"; 
      console.log("Tokens for the redirect: ",tokens, " redirect: ", redirectPath);
      navigate(redirectPath);
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

      // Check if the user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User already exists, check for first and last name
        const userData = userDocSnap.data();
        if (!userData.firstName || !userData.lastName) {
          // Extract first and last name from displayName
          let [firstName, lastName] = user.displayName ? user.displayName.split(' ') : ['',''];
          lastName = lastName || ''; // In case lastName is undefined or empty

          // Update the user document with missing names
          await setDoc(userDocRef, { ...userData, firstName: firstName, lastName: lastName }, { merge: true });
        }
      } else {
        // User is new, extract first and last name from displayName
        let [firstName, lastName] = user.displayName ? user.displayName.split(' ') : ['',''];
        lastName = lastName || ''; // In case lastName is undefined or empty

        // Create a new document for the user with the extracted names
        await setDoc(userDocRef, {
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          role: "user", // Assign a default role or any other initial properties
          tokens: 2,
          desiredPurchase: 0,
          paying: false
        });
      }

      // Handle user role setting and navigation as before
      const userRole = await fetchUserRole(user.uid);
      setUserRole(userRole || 'user');
      const redirectPath = tokens > 0 ? "/purchase" : "/menu"; // Redirect to purchase if tokens are selected
      navigate(redirectPath);
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
  
  const navigateTo = (path) => {
    navigate(path);
  };
  
  return (
    <div className="login-container">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <h1 className="login-header-title">iSpeakWell</h1>
      <h5 className="tagline">Shape Your Resume, Cover Letter, and Interview Language with Professionalism, Confidence, and Distinction.</h5>
      <h3>Revise with OpenAI.</h3>
      <form className="Login-Input" onSubmit={handleLogin}>
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
      <h3 className = "noAccount">
        Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
      </h3>
      <h3 className = "forgotPWD">
        Forgot your password? <Link to="/password-reset" className="pwReset-link">Reset it here</Link>
      </h3>
      <div className="links-section">
        <a onClick={() => navigateTo("/about")} href="/about">
          About
        </a>
        <a onClick={() => navigateTo("/careers")} href="/careers">
          Careers
        </a>
        <a onClick={() => navigateTo("/tokens")} href="/tokens">
          Tokens
        </a>
        <a onClick={() => navigateTo("/contactus")} href="contactus">
          Contact Us
        </a>
        <a onClick={() => navigateTo("/login")} href="login">
          Login
        </a>
      </div>
    </div>
  );
}
export default Login;
