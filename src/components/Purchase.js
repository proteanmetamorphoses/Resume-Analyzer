// Tokens.js
import React, { useContext, useState } from "react";
import { TokenContext } from "./tokenContext"; // import TokenContext
import HexagonBackground from "./HexagonBackground";
import "./Tokens.css";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { loadStripe } from "@stripe/stripe-js";
//const stripePromise = loadStripe('pk_live_51OUJ8RJs2pb8XH4PAC5jjh24HPSXDsYquxF8dkFwZJqzM3upN2rq56lWPNisXHcYZH7ifvwjY8ggZzroyS5pXHmD00Wb3XO5Zn');
const stripePromise = loadStripe(
  "pk_test_51OUJ8RJs2pb8XH4PIPjNQmICJFFURBUJ2CcYmcfH24Gf2NLDXp9Cb6Uw3UdxQYciqlYkG3TqHEEgo0LdjybUtb84001AJe74KW"
);

function Purchase() {
  const { tokens, setTokens } = useContext(TokenContext); // Use TokenContext
  const [selectedTokens, setSelectedTokens] = useState(tokens); // State for selected token amount
  console.log("selectedTokens: ", selectedTokens);

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

  return (
    <div className="Tokens-container">
      <HexagonBackground />
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
      <h2 className="under-construction-text">What Are Tokens For?</h2>
      <p className="divMsg">
        Tokens are your ticket to performing the resume or speech work you want
        to do. With tokens, you can revise your resume and get a matching cover
        letter. You can do a practice interview. You can also have a practice
        conversation to feel more fluent.
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
    </div>
  );
}
export default Purchase;
