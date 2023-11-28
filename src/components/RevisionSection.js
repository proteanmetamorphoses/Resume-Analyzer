import React, { useState, useRef, useEffect } from "react";
import "./RevisionSection.css";
import Spinner from "./Spinner";

function RevisionSection({
  statusMessage = "",
  missingKeywords = [],
  assessment = "",
  employabilityScore = 0,
  bestPossibleJob = "",
  onSubmitRevisions,
  originalResume,
  originalJobDescription,
  isRevising,
  revisionCompleted,
}) {
  const [userRevisions, setUserRevisions] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const revisionTextAreaRef = useRef(null);
  const [userRevisionsTextCount, setUserRevisionsTextCount] = useState(0);

  useEffect(() => {
    // Adjust the height of the textarea
    if (revisionTextAreaRef.current) {
      revisionTextAreaRef.current.style.height = "auto"; // Reset height
      revisionTextAreaRef.current.style.height = `${revisionTextAreaRef.current.scrollHeight}px`; // Set to scroll height
    }
    setUserRevisionsTextCount(userRevisions.length);
  }, [userRevisions]);

  const handleFocus = () => {
    if (!isTouched) {
      setUserRevisions(missingKeywords.join("\n"));
      setIsTouched(true);
    }
  };

  const handleSubmitRevisions = () => {
    onSubmitRevisions(originalResume, originalJobDescription, userRevisions);
  };
  return (
    <div className="revision-section">
      <h3>Resume Analysis Based on Job Description</h3>

      <div className="missing-keywords">
        <h4 className="Revision-Headers">Missing Keywords:</h4>
        <ul>
          {missingKeywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
        <h4 className="Revision-Headers">Assessment:</h4>
        <p className="Revision-Item">{assessment}</p>
        <h4 className="Revision-Headers">Best Possible Job:</h4>
        <p className="Revision-Item">{bestPossibleJob}</p>
      </div>
      <div className="missing-details">
        <h3>
          To be competetive, add specific details about the following missing
          keywords:
        </h3>
        <textarea
          className="revision-textarea"
          ref={revisionTextAreaRef} // Use the ref here
          value={userRevisions}
          onChange={(e) => setUserRevisions(e.target.value)}
          onFocus={handleFocus}
          placeholder={!isTouched ? missingKeywords.join("\n") : ""}
        />
      </div>

      {!isRevising && !revisionCompleted && userRevisionsTextCount > 1 && (
        <button className="analysis-button" onClick={handleSubmitRevisions}>
          Revise
        </button>
      )}
      {isRevising && (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default RevisionSection;
