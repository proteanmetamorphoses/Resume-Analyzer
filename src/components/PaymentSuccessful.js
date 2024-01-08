import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./tokenContext";
import "./PaymentSuccessful.css";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { v4 as uuidv4 } from "uuid";
import Spinner from "./Spinner";

function PaymentSuccessful() {
  const navigate = useNavigate();
  const { setTokens } = useContext(TokenContext);
  const [hasCheckedPayment, setHasCheckedPayment] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const uniqueId = uuidv4(); // Generate unique ID for success log
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");
  const MAX_ATTEMPTS = 10;
  const INITIAL_INTERVAL = 3000; // 3 seconds
  const MAX_INTERVAL = 60000; // 60 seconds
  const [receiptUrl, setReceiptUrl] = useState("No purchase recorded.");

  useEffect(() => {
    if (hasCheckedPayment) {
      return; // Prevents useEffect from running more than once
    }
    
    if (!sessionId) {
      navigate("/paymentnotsuccessful");
      return;
    }

    const transferDesiredPurchaseToTokens = async (newReceiptUrl) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!userData.paying) {
              logTokenTransfer(user.uid, 0, uniqueId, "ERROR - Not Successful");
              navigate("/paymentnotsuccessful");
              return;
            }
            const desiredPurchase = userData.desiredPurchase || 0;
            const userDataTokens = userData.tokens + desiredPurchase;
            // Update tokens field with desiredPurchase value
            await updateDoc(userRef, {
              tokens: userDataTokens,
              desiredPurchase: 0,
              paying: false,
              receiptUrl: newReceiptUrl,
            });
            // Update local token context
            setTokens(userData.tokens + desiredPurchase);
            // Log the successful transfer
            logTokenTransfer(user.uid, desiredPurchase, uniqueId, "Successful", newReceiptUrl);
            setTransactionId(uniqueId); // Set for display purposes
            setHasCheckedPayment(true);
            document.getElementById('PaymentType').textContent = 'Payment Successful';
          }
        } catch (error) {
          console.error(
            "Error transferring desired purchase to tokens.",
            error
          );
          try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (!userData.paying) {
                logTokenTransfer(
                  user.uid,
                  0,
                  uniqueId,
                  "ERROR - Not Successful", newReceiptUrl
                );
                navigate("/paymentnotsuccessful");
                return;
              }
            }
          } catch (error) {}
        }
      }
    };

    const logTokenTransfer = async (userId, tokens, uniqueId, status, receipt) => {
      const logRef = collection(db, "tokenTransfers");
      const logData = {
        date: new Date(),
        userId: userId,
        tokens: tokens,
        uniqueId: uniqueId,
        sessionId: sessionId,
        status: status,
        receiptUrl: receipt,
      };

      try {
        await addDoc(logRef, logData);
        console.log("Log entry created successfully");
      } catch (error) {
        console.error("Error logging token transfer: ", error);
      }
    };

    function pollPaymentStatus(sessionId, attempt = 1) {
      let interval = Math.min(
        INITIAL_INTERVAL * Math.pow(2, attempt - 1),
        MAX_INTERVAL
      );
      fetch("http://localhost:3001/api/payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.receipt_url) {
            console.log(data.receipt_url);
            // Handle receipt URL
            setReceiptUrl(data.receipt_url);
            transferDesiredPurchaseToTokens(data.receipt_url);
          } else if (attempt < MAX_ATTEMPTS) {
            // Retry after the interval
            setTimeout(
              () => pollPaymentStatus(sessionId, attempt + 1),
              interval
            );
          } else {
            // Handle maximum attempts reached
            console.log("No receipt url received.");
            navigate("/pageexpired");
          }
        })
        .catch((error) => {
          // Handle error
        });
      console.log("Waiting for a reply from the payment server...");
    }

    pollPaymentStatus(sessionId);

  }, [setTokens, navigate, hasCheckedPayment, uniqueId, sessionId, receiptUrl]);

  
  const handleButtonClick = () => {
    window.open(receiptUrl, "_blank");
  };

  const copyReceiptURLToClipboard = () => {
    navigator.clipboard.writeText(receiptUrl).then(() => {
      alert("Receipt URL copied to clipboard!");
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionId).then(() => {
      alert("Transaction number copied to clipboard!");
    });
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="Menu-container">
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagLine">
        Shape Your Resume, Cover Letter, and Interview Language with
        Professionalism, Confidence, and Distinction.
      </h5>
      <hr />
      <h1 id="PaymentType" className="Task-Menu">Payment Pending</h1>
      {!transactionId && (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      )}
      {transactionId && (
        <div className="Transaction">
          <h2 className="Task-Menu">
            Thank you for your purchase.
          </h2>
          <h3 className="Task-Menu">
            Your token count has been increased.
          </h3>
          <h4 className="TransactionNumber">
            Transaction number: {transactionId}
          </h4>
          <button onClick={copyToClipboard}>Copy Transaction Number</button>
          <h5 className="TransactionNumber">Receipt URL: {receiptUrl}</h5>
          <div className="ReceiptButtons">
            <button onClick={handleButtonClick}>View</button>
            <button onClick={copyReceiptURLToClipboard}>Copy URL</button>
          </div>
        </div>
      )}

      <hr />
      {transactionId && (
        <div className="ContinuingOn">
          <h2 className="Task-Menu">Select a task to continue</h2>
          <div className="BTN-HLDR">
            <button onClick={() => navigateTo("/resumerevisor")}>
              Resume and Cover Letter
            </button>
            <button onClick={() => navigateTo("/interview-practice")}>
              Interview Practice
            </button>
            <button onClick={() => navigateTo("/conversationpractice")}>
              Conversation Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentSuccessful;
