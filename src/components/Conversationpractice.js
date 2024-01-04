import HexagonBackground from "./HexagonBackground";
import "./Conversationpractice.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/firebase";
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


  return (
    <div className="about-container">
      <HexagonBackground />
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language with Professionalism, Confidence, and Distinction.
      </h5>
      <h2 className="under-construction-text">shhh!...This Area Is Under Construction...Don't Tell Anyone.</h2>
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
