import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, createUserWithEmailAndPassword } from "../utils/firebase";
import { Link } from "react-router-dom";
import "./Signup.css";
import HexagonBackground from "./HexagonBackground";

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
      await createUserWithEmailAndPassword(auth, email, password);
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
      <h1 className="supheader-title">Advanced Resume</h1>
      <form onSubmit={handleSignup}>
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
      <p className="link-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
