import React, { useState } from 'react';
import './RevisionSection.css';


function RevisionSection({ missingKeywords = [], onSubmitRevisions }) {
  const [userRevisions, setUserRevisions] = useState('');

  const handleSubmitRevisions = () => {
    // Call the ChatGPT API to submit revisions and update the resume
    onSubmitRevisions(userRevisions);
  };

  return (
    <div className="revision-section">
      <h3>Resume Analysis Based on Job Description</h3>
      <div className="missing-keywords">
        <ul>
          {missingKeywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
      <h3>Add Details for Missing Job Description Details to Include</h3>
      <div className="revision-input">
        <textarea
          value={userRevisions}
          onChange={(e) => setUserRevisions(e.target.value)}
          placeholder="Add details for missing keyphrases."
        />
      </div>
      <button onClick={handleSubmitRevisions}>Submit Revisions</button>
    </div>
  );
}

export default RevisionSection;
