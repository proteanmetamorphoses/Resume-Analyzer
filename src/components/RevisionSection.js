import React, { useState, useRef, useEffect } from "react";
import "./RevisionSection.css";
import Spinner from "./Spinner";

function RevisionSection({
  missingKeywords = [],
  assessment = "",
  bestPossibleJob = "",
  onSubmitRevisions,
  originalResume,
  originalJobDescription,
  isRevising,
  revisionCompleted,
  testing,
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
        <h4 className="Revision-Headers">Additional Alternative Job:</h4>
        <p className="Revision-Item">{bestPossibleJob}</p>
      </div>
      <div className="missing-details">
        <h3>
          To be competetive, add specific details about the following missing
          keywords:
        </h3>
        {!testing && (
        <textarea
          className="revision-textarea"
          ref={revisionTextAreaRef} // Use the ref here
          value={userRevisions}
          onChange={(e) => setUserRevisions(e.target.value)}
          onFocus={handleFocus}
          placeholder={!isTouched ? missingKeywords.join("\n") : ""}
        />
        )}
        {testing &&(
          <textarea
          className="revision-textarea"
          ref={revisionTextAreaRef} // Use the ref here
          value={"Styled Components:  I can adjust my CSS styling approach to utilize styled components.  In fact, this would make working with components much easier since I can see what the component will look like as I'm working with it.\nTypeScript is a language similar to JavaScript, and I'm really looking forward to working with it as I do most of my programming in JavaScript.\nNode.js: I am familiar with Node.JS.  All my current projects and APIs use Node.js.\nStrapi:  I'm looking forward to learning about Strapi.\nCloudflare Workers: I'm looking forward to learning about Cloudflare Workers.\nCloudflare Durable Objects: I'm looking forward to learning about Cloudflare Durable Objects.\nServerless functions: My current project, Advanced Resume, uses a serverless function that I developed.\nCI/CD: At Technology North, I collaborated with the development team to daily improve the TNDS module and working directly with the digitization team and developers to revise bugs and other issues, enabling significantly improved productivity. During my REACT training, I came to understand the principles of CI/CD.\nRestAPI: I have created a RestAPI which is in use with my project application, Advanced Resume.\nWorking with GraphQL will make my API queries more powerful."}
          onChange={(e) => setUserRevisions(e.target.value)}
          onFocus={handleFocus}
          placeholder={!isTouched ? missingKeywords.join("\n") : ""}
        />
        )}
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
