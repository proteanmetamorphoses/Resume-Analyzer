import React from "react";
import KeywordsList from "./KeywordsList";
import ATSScore from "./ATSScore";
import "./ResultsSection.css";

function ResultsSection({ resumeKeywords, jobDescriptionKeywords, atsScore }) {
  return (
    <div className="results-section">
      <div className="keywords-container">
        <KeywordsList type="resume" keywords={resumeKeywords} />
      </div>
      <div className="keywords-container">
        <KeywordsList type="jobDescription" keywords={jobDescriptionKeywords} />
      </div>
      <h3>Initial Resume Fit (&gt;=90% is more competitive)</h3>
      <div className="results-ats-score">
        <ATSScore score={atsScore} />
      </div>
    </div>
  );
}

export default ResultsSection;
