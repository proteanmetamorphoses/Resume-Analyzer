import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentNotSuccessful.css';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase'; // Ensure this points to your Firestore instance

function PaymentNotSuccessful() {
  const navigate = useNavigate();

  useEffect(() => {
    const resetDesiredPurchase = async () => {
      const auth = getAuth();
      const user = auth.currentUser; // Get current user

      if (user) {
        const userRef = doc(db, 'users', user.uid); // Reference to user's document in Firestore
        try {
          await updateDoc(userRef, {
            desiredPurchase: 0 // Resetting desiredPurchase
          });
          console.log('desiredPurchase reset successfully');
        } catch (error) {
          console.error('Error resetting desiredPurchase: ', error);
        }
      }
    };

    resetDesiredPurchase();
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="Menu-container">
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagLine">
        Shape Your Resume, Cover Letter, and Interview Language with Professionalism, Confidence, and Distinction.
      </h5>
      <hr />
      <h1 className = "Task-Menu">Payment Incomplete</h1>
      <h3 className="Task-Menu">Your tokens have not been updated.</h3>
      <hr />
      <h2 className="Task-Menu">Select a task to continue</h2>
      <div className="BTN-HLDR">
        <button onClick={() => navigateTo("/resumerevisor")}>Resume and Cover Letter</button>
        <button onClick={() => navigateTo("/interview-practice")}>Interview Practice</button>
        <button onClick={() => navigateTo("/conversationpractice")}>Conversation Practice</button>
      </div>
      <div className="BTN-HLDR"><button onClick={() => navigateTo("/purchase")}>Buy Tokens</button></div>
    </div>
  );
}

export default PaymentNotSuccessful;
