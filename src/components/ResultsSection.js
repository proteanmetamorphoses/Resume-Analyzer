import React from 'react';
import KeywordsList from './KeywordsList';
import ATSScore from './ATSScore';

function ResultsSection({ resumeKeywords, jobDescriptionKeywords, atsScore }) {
  return (
    <div className="results-section">
      <KeywordsList type="resume" keywords={resumeKeywords} />
      <KeywordsList type="jobDescription" keywords={jobDescriptionKeywords} />
      <ATSScore score={atsScore} />
    </div>
  );
}

export default ResultsSection;
