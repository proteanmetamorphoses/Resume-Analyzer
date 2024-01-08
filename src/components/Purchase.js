// Tokens.js
import React, { useContext, useState } from "react";
import { TokenContext } from "./tokenContext"; // import TokenContext
import { useNavigate } from "react-router-dom";
import "./Purchase.css";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { logout } from "../utils/firebase";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { loadStripe } from "@stripe/stripe-js";
//const stripePromise = loadStripe('pk_live_51OUJ8RJs2pb8XH4PAC5jjh24HPSXDsYquxF8dkFwZJqzM3upN2rq56lWPNisXHcYZH7ifvwjY8ggZzroyS5pXHmD00Wb3XO5Zn');
const stripePromise = loadStripe(
  "pk_test_51OUJ8RJs2pb8XH4PIPjNQmICJFFURBUJ2CcYmcfH24Gf2NLDXp9Cb6Uw3UdxQYciqlYkG3TqHEEgo0LdjybUtb84001AJe74KW"
);

function Purchase() {
  const { tokens, setTokens } = useContext(TokenContext); // Use TokenContext
  const [selectedTokens, setSelectedTokens] = useState(tokens); // State for selected token amount
  const navigate = useNavigate();
  console.log("selectedTokens: ", selectedTokens);
  const [isOpen, setIsOpen] = React.useState(false);

const goAway = () => {
  navigate("/menu");
}


  const handleTokenPurchase = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    setTokens(selectedTokens);
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        // Update desiredPurchase in Firestore
        await updateDoc(userRef, {
          desiredPurchase: parseInt(selectedTokens, 10), // Ensure it's an integer
          paying: true,
        });
        const stripe = await stripePromise;
        try {
          console.log("SelectedTokens: ", selectedTokens);
          const response = await fetch(
            "http://localhost:3001/api/create-checkout-session",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ quantity: selectedTokens }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Session data:", data);

          if (data.sessionId) {
            const result = await stripe.redirectToCheckout({
              sessionId: data.sessionId,
            });

            if (result.error) {
              console.log(result.error.message);
            }
          } else {
            console.log("No session ID returned from the server");
          }
        } catch (error) {
          console.error("Error in handleTokenPurchase:", error.message);
        }
      } catch (error) {
        console.error("Error setting desiredPurchase:", error);
      }
    }
  };

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

  const ConversationPractice = () => {
    navigate("/conversationPractice");
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
        <ListItemButton onClick={ConversationPractice}>
          <ListItemText primary="Conversation Practice" />
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
    <div className="Purchase-container">
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language with
        Professionalism, Confidence, and Distinction.
      </h5>
      <h1>Purchase Tokens</h1>
      <input
        className="TokenNum"
        type="number"
        value={selectedTokens}
        onChange={(e) => setSelectedTokens(e.target.value)}
        min="0"
      />
      <button onClick={handleTokenPurchase}>Purchase Tokens</button>
      <button className = "menuGoer" onClick={goAway}>Menu</button>
      <h2 className="under-construction-text">What Are Tokens For?</h2>
      <p className="divMsg">
        Tokens enable you to perform the resume or speech work you want
        to do. With tokens, you can revise your resume and get a matching cover
        letter. You can do a practice interview. You can also have a practice
        conversation to develop your speaking fluency.
      </p>
      <h4>Tokens Required for Conversation Practice</h4>
      <p className="divMsg">
        One (1) token is required for Conversation Practice (1,200 words approximately)
      </p>
      <h4>Tokens Required for Resume Revision and Cover Letter</h4>
      <p className="divMsg">
        One (1) token is required for Resume Revision and Cover Letter
      </p>
      <h4>Tokens Required for Interview Practice</h4>
      <p className="divMsg">
        One (1) token is required for Interview Practice (5 questions)
      </p>
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
          <button className="link-button" onClick={() => navigateTo("/about")}>About</button>
          <button className="link-button" onClick={() => navigateTo("/careers")}>Careers</button>
          <button className="link-button" onClick={() => navigateTo("/tokens")}>Tokens</button>
          <button className="link-button" onClick={() => navigateTo("/contactus")}>Contact Us</button>
          <button className="link-button" onClick={() => navigateTo("/login")}>Login</button>
        </div>
    </div>
  );
}
export default Purchase;
