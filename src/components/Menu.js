import "./Menu.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import VoiceBotIframe from "./VoiceBotiFrame";
function Menu() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="menu-container">
      <h1 className="menu-header-title">iSpeakWell</h1>
      <h5 className="tagLine">
        Menu
      </h5>
      <div className="VoiceBot-container">
        <VoiceBotIframe />
      </div>
      <h2 className="Task-Menu">Select a Task</h2>
      <div className="BTN-HLDR">
        <button onClick={() => navigateTo("/resumerevisor")}>Resume and Cover Letter</button>
        <button onClick={() => navigateTo("/interview-practice")}>Interview Practice</button>
        <button onClick={() => navigateTo("/conversationpractice")}>Conversation Practice</button>
      </div>
      <div className="BTN-HLDR" onClick={() => navigateTo("/Purchase")}><button>Buy Tokens</button></div>
    </div>
  );
}
export default Menu;
