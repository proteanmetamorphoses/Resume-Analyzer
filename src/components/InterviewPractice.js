import React, { useState, useEffect } from "react";
import LogoutLink from "./LogoutLink";
import VoiceBotIframe from "./VoiceBotiFrame";
import HexagonBackground from "./HexagonBackground";
import "./InterviewPractice.css";
import { useNavigate } from 'react-router-dom';

  
const InterviewPractice = () => {
  const navigate = useNavigate();
  let AudioFile = 27; 


  function handleVBLastButtonClick(filename) {
  
    AudioFile--;
    if(AudioFile < 27){
      AudioFile = 27;
    }
    var iframeWindow = document.getElementById('theBot').contentWindow;
    iframeWindow.postMessage(AudioFile, 'https://www.ispeakwell.ca/');
  }
  
  function handleVBNextButtonClick() {
    AudioFile++;
    if(AudioFile > 102){
      AudioFile = 102;
    }
    var iframeWindow = document.getElementById('theBot').contentWindow;
    iframeWindow.postMessage(AudioFile, 'https://www.ispeakwell.ca/');
  }

  const Dashboard = () => {
    // Navigate to the InterviewPractice page
    navigate('/Dashboard');
  };

    return <div className = "InterviewPractice">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <h1 className="Main-Header">Advanced Resume</h1>
      <h2 className="Main-Header">
        Interview Practice
      </h2>
      <h3 className="instruct1">Click a document to view</h3>
      <div className="VoiceBot-container">
              <VoiceBotIframe />
              <div className="VBButtons">
                <button onClick={handleVBLastButtonClick}>Last</button>
                <button onClick={handleVBNextButtonClick}>Next</button>
              </div>
      </div>
      <nav className="logout-nav">
        <button className="interView" onClick={Dashboard}>Dashboard</button>
        <LogoutLink />
      </nav>

      </div>;
      };
  
  export default InterviewPractice;
  