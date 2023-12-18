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
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        role: "user" // Assigning a default role, you can customize this part
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
      <h1 className="supheader-title">Advanced Career</h1>
      <form className="SignUp-Input" onSubmit={handleSignup}>
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
    </div>
  );
}

export default Signup;
