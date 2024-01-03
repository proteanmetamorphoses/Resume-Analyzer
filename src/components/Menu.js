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
      <h5 className="tagLine">
        Shape Your Resume, Cover Letter, and Interview Language with Professionalism, Confidence, and Distinction.
      </h5>
      <h2 className="Task-Menu">Select a Task</h2>
      <div className="BTN-HLDR">
        <button onClick={() => navigateTo("/resumerevisor")}>Resume and Cover Letter</button>
        <button onClick={() => navigateTo("/interview-practice")}>Interview Practice</button>
        <button onClick={() => navigateTo("/conversationpractice")}>Conversation Practice</button>
      </div>
      <div className="BTN-HLDR" onClick={() => navigateTo("/Tokens")}><button>Buy Tokens</button></div>
    </div>
  );
}
export default Menu;
