import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./InterviewTips.css";
const InterviewTips = () => {
  const [tips, setTips] = useState([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Read CSV file and update state
    Papa.parse("/data/interviewTips.csv", {
      download: true,
      complete: (results) => {
        setTips(results.data); // Assuming each row is a tip
      },
    });
  }, []);

  useEffect(() => {
    // Set a timer to change tip every 15 seconds
    const timer = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 15000);

    // Clear the timer on unmount
    return () => clearInterval(timer);
  }, [tips]);

  const nextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex(
      (prevIndex) => (prevIndex - 1 + tips.length) % tips.length
    );
  };

  const renderTip = (tipData) => {
    // Check if tipData is an array and convert it to a string if necessary
    const tip = Array.isArray(tipData) ? tipData.join(", ") : tipData;
    const [header, ...content] = tip.split(": ");
    return (
      <div className="interviewTipBucket">
        <h3 className="tipHeader">{header}</h3>
        <p className="tipContent">{content.join(": ")}</p>
      </div>
    );
  };

  return (
    <div className="interviewTips">
      <h3 className = "Instruct1">Interview Tips</h3>
      {tips.length > 0 && (
        <div className="interviewTipBox">
          {renderTip(tips[currentTipIndex])}
        </div>
      )}
      <div className="interviewTipButtons">
        <button onClick={prevTip}>←</button>
        <button onClick={nextTip}>→</button>
      </div>
    </div>
  );
};

export default InterviewTips;
