import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './tokenContext';
import HexagonBackground from './HexagonBackground';
import './PaymentSuccessful.css';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

function PaymentSuccessful() {
  const navigate = useNavigate();
  const { setTokens } = useContext(TokenContext);

  useEffect(() => {
    const transferDesiredPurchaseToTokens = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();

            if (!userData.paying) {
              navigate("/paymentnotsuccessful");
              return;
            }

            const desiredPurchase = userData.desiredPurchase || 0;

            // Update tokens field with desiredPurchase value
            await updateDoc(userRef, {
              tokens: userData.tokens + desiredPurchase,
              desiredPurchase: 0, // Resetting desiredPurchase
              paying: false
            });

            // Update local token context
            setTokens(userData.tokens + desiredPurchase);
            console.log('Tokens updated successfully');
          }
        } catch (error) {
          console.error('Error in transferring desired purchase to tokens: ', error);
        }
      }
    };

    transferDesiredPurchaseToTokens();
  }, [setTokens, navigate]);

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
      <hr />
      <h1 className = "Task-Menu">Payment Successful</h1>
      <h2 className="Task-Menu">Thank you for your purchase. Your token count has been updated.</h2>
      <hr />
      <h2 className="Task-Menu">Select a task to continue</h2>
      <div className="BTN-HLDR">
        <button onClick={() => navigateTo("/resumerevisor")}>Resume and Cover Letter</button>
        <button onClick={() => navigateTo("/interview-practice")}>Interview Practice</button>
        <button onClick={() => navigateTo("/conversationpractice")}>Conversation Practice</button>
      </div>
    </div>
  );
}

export default PaymentSuccessful;
