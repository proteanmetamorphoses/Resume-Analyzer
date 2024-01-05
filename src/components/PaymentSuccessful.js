import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./tokenContext";
import HexagonBackground from "./HexagonBackground";
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
  console.log("SessionId: ", sessionId);
  const MAX_ATTEMPTS = 5;
  const INITIAL_INTERVAL = 3000; // 3 seconds
  const MAX_INTERVAL = 60000; // 60 seconds
  const [receiptUrl, setReceiptUrl] = useState("");

  useEffect(() => {
    if (hasCheckedPayment) {
      console.log("Just passing through...0");
      return; // Prevents useEffect from running more than once
    }
    if (!sessionId) {
      navigate("/paymentnotsuccessful");
      return;
    }

    const transferDesiredPurchaseToTokens = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        console.log("Just passing through...1");
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
            console.log("Just passing through...2");
            // Update tokens field with desiredPurchase value
            await updateDoc(userRef, {
              tokens: userData.tokens + desiredPurchase,
              desiredPurchase: 0,
              paying: false,
            });
            console.log("Just passing through...3");
            // Update local token context
            setTokens(userData.tokens + desiredPurchase);
            console.log("Just passing through...4");
            // Log the successful transfer
            logTokenTransfer(user.uid, desiredPurchase, uniqueId, "Successful");
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
                  "ERROR - Not Successful"
                );
                navigate("/paymentnotsuccessful");
                return;
              }
            }
          } catch (error) {}
        }
      }
    };

    const logTokenTransfer = async (userId, tokens, uniqueId, status) => {
      console.log("Just passing through...5");
      const logRef = collection(db, "tokenTransfers");
      const logData = {
        date: new Date(),
        userId: userId,
        tokens: tokens,
        uniqueId: uniqueId,
        sessionId: sessionId,
        status: status,
      };

      try {
        console.log("Just passing through...6");
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
            transferDesiredPurchaseToTokens();
          } else if (attempt < MAX_ATTEMPTS) {
            // Retry after the interval
            setTimeout(
              () => pollPaymentStatus(sessionId, attempt + 1),
              interval
            );
          } else {
            // Handle maximum attempts reached
            console.log("No receipt url received.");
            navigate("/paymentnotsuccessful");
          }
        })
        .catch((error) => {
          // Handle error
        });
      console.log("Waiting for a reply from the payment server...");
    }

    // Start polling after the user initiates a payment
    // Assuming sessionId is obtained after initiating the payment
    pollPaymentStatus(sessionId);

    console.log("Just passing through...7");
  }, [setTokens, navigate, hasCheckedPayment, uniqueId, sessionId]);

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
      <HexagonBackground />
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
          <h3 className="Task-Menu">
            Thank you for your purchase. Your token count has been updated.
          </h3>
          <h3 className="TransactionNumber">
            Transaction number: {transactionId}
          </h3>
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
