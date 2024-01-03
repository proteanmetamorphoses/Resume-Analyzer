import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, createUserWithEmailAndPassword } from "../utils/firebase";
import { Link } from "react-router-dom";
import "./Signup.css";
import HexagonBackground from "./HexagonBackground";
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../utils/firebase"; // Import your Firestore instance

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const isStrongPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password should be at least 8 characters, contain a number and an uppercase letter."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Add a new document in collection "users" with the user's UID
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: "user",
        tokens: 2,
        desiredPurchase: 0
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <h1 className="supheader-title">iSpeakWell</h1>
      <h5 className="tagline">Shape Your Resume, Cover Letter, and Interview Language</h5>
      <h5 className="tagline"> with Professionalism, Confidence, and Distinction.</h5>
      <h3>Revise with OpenAI.</h3>
      <form className="SignUp-Input" onSubmit={handleSignup}>
      <h4>Please enter your name:</h4>
      <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <h4>Please enter your email:</h4>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <h3 className="link-text">
        Already have an account? <Link className="LogLink" to="/login">Login</Link>
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

export default Signup;
