import HexagonBackground from "./HexagonBackground";
import "./Menu.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="Menu-container">
      <HexagonBackground />
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language
      </h5>
      <h5 className="tagline">
        {" "}
        with Professionalism, Confidence, and Distinction.
      </h5>
      <h2 className="Task-Menu">Select a Task</h2>
      <div className="BTN-HLDR">
        <button onClick={() => navigateTo("/resumerevisor")}>Resume and Cover Letter</button>
        <button onClick={() => navigateTo("/interview-practice")}>Interview Practice</button>
        <button onClick={() => navigateTo("/conversationpractice")}>Conversation Practice</button>
      </div>
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
export default Menu;
