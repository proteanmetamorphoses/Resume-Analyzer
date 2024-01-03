import HexagonBackground from "./HexagonBackground";
import "./Conversationpractice.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function ConversationPractice() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="about-container">
      <HexagonBackground />
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language with Professionalism, Confidence, and Distinction.
      </h5>
      <h2 className="under-construction-text">shhh!...This Area Is Under Construction...Don't Tell Anyone.</h2>
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
export default ConversationPractice;
