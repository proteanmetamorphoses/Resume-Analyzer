import React, { useState } from 'react';
import './RevisionSection.css';


function RevisionSection({ missingKeywords = [], assessment = '', employabilityScore = 0, bestPossibleJob = '', onSubmitRevisions, originalResume, originalJobDescription }) {
  const [userRevisions, setUserRevisions] = useState('');
  const [isTouched, setIsTouched] = useState(false);


  const handleFocus = () => {
      if (!isTouched) {
          setUserRevisions(missingKeywords.join('\n'));
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
      <h4>Missing Keywords:</h4>
      <ul>
        {missingKeywords.map((keyword, index) => (
          <li key={index}>{keyword}</li>
        ))}
      </ul>
      <h4>Assessment:</h4>
      <p>{assessment}</p>
      <h4>Best Possible Job:</h4>
      <p>{bestPossibleJob}</p>
    </div>

          <div className="missing-details">
          <h3>Add Missing Keyword Details for the following items:</h3>
              <textarea
                  value={userRevisions}
                  onChange={(e) => setUserRevisions(e.target.value)}
                  onFocus={handleFocus}
                  placeholder={!isTouched ? missingKeywords.join('\n') : ''}
              />
          </div>
          <button className="analysis-button" onClick={handleSubmitRevisions}>Revise</button>
      </div>
  );
}


export default RevisionSection;
