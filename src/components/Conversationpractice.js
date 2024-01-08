import "./Conversationpractice.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/firebase";
import VoiceBotIframe from "./VoiceBotiFrame";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { getAuth } from "firebase/auth";
import { db } from "../utils/firebase";
import {
  doc,
  getDoc,
} from "firebase/firestore";

function ConversationPractice() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const fetchTokens = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setTokens(userDoc.data().tokens || 0);
          }
        } catch (error) {
          console.error("Error fetching token count: ", error);
        }
      }
    };

    fetchTokens();
  }, [tokens]);

  const navigateTo = (path) => {
    navigate(path);
  };

  const InterViewPractice = () => {
    // Navigate to the InterviewPractice page
    navigate("/interview-practice");
  };
  
  const Dashboard = () => {
    navigate("/resumerevisor");
  };

  const Purchase = () => {
    navigate("/purchase");
  };


  const admin = () => {
    navigate("/admin");
  };

  const Logout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };
  

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItemButton onClick={Purchase}>
          <ListItemText primary={`Tokens: ${tokens}`} />
        </ListItemButton>
        <ListItemButton onClick={Dashboard}>
          <ListItemText primary="Resume Revisor" />
        </ListItemButton>
        <ListItemButton onClick={InterViewPractice}>
          <ListItemText primary="Interview Practice" />
        </ListItemButton>
        <ListItemButton onClick={admin}>
          <ListItemText primary="Admin" />
        </ListItemButton>
        <ListItemButton onClick={Logout}>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );
const handleUserTyping = () =>{

}
const shouldBlockAnswer = () =>{

}

const startListening = () =>{

}

const stopListening = () => {

}

const handleSubmit = () => {

}

const clearTextArea = () => {
  
}



  return (
    <div className="Conversation-Practice-container">
        <h1 className="Main-Header-convo">iSpeakWell Conversation Practice</h1>
        <h2 className="Main-Header-tagline">Practice Speaking with AI</h2>
      <div className="VoiceBot-container">
        <VoiceBotIframe />
      </div>
      <div className="UserControls">
        <textarea
          id="speech"
          className="userSpeech"
          onChange={handleUserTyping}
          placeholder="Position your microphone close to your mouth but away from your speech stream.

          Type here or click the `Respond` button, below, to use speech recognition when you receive a question to answer."
          disabled={shouldBlockAnswer()}
        ></textarea>
        <h4 className="instruct1">Wait for <u>your turn</u> to input your reply.</h4>

        <div className="SpeechRecButtons">
          <button
            className="StartListeningButton"
            onClick={startListening}

          >
            Respond
          </button>
          <button
            className="StpBttn"
            onClick={stopListening}

          >
            Stop
          </button>
          <button
            className="submitAnswer"
            onClick={handleSubmit}

          >
            Add
          </button>
          <button className="clearButton" onClick={clearTextArea}>
            Clear
          </button>
        </div>
      </div>
      <nav className="logout-nav">
        {/* Hamburger Menu Icon */}
        <IconButton className="menu-icon" onClick={toggleDrawer(true)}>
          <MenuIcon
            style={{
              boxShadow: "0 0 50px #000000, 0 0 20px #ffffff",
              // Add additional styles if needed
            }}
          />
        </IconButton>

        {/* Drawer for Mobile View */}
        <Drawer
          anchor="left"
          open={isOpen}
          onClose={toggleDrawer(false)}
          className="custom-drawer"
        >
          {list()}
        </Drawer>
      </nav>
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
