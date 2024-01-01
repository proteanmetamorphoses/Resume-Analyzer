import { useState } from "react";
import { auth, sendPasswordResetEmail } from "../utils/firebase";
import "./PasswordReset.css";
import HexagonBackground from "./HexagonBackground";
import { Link } from "react-router-dom";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const handlePasswordReset = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Check your email (including spam or junk box) for your password reset link."
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="password-reset-container">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <div className="header-container">
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">Shape Your Resume, Cover Letter, and Interview Language</h5>
      <h5 className="tagline"> with Professionalism, Confidence, and Distinction</h5>
      <h3>Revise with OpenAI.</h3>
        <h2 className="header-subtitle">Password Reset</h2>
      </div>
      <form className="prform" onSubmit={handlePasswordReset}>
        <input
          className="prinput"
          type="email"
          placeholder="Enter account email to retrieve password"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="prbutton" type="submit">
          Submit
        </button>
      </form>
      <h3 className="link-text">
        Changed your mind? No problem...Back to <Link className="LogLink" to="/login">Login</Link>
      </h3>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default PasswordReset;
