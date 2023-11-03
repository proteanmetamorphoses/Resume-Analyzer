// RevisionSection.js
import React, { useState } from 'react';

function RevisionSection({ missingKeywords = [], onSubmitRevisions }) {
  const [userRevisions, setUserRevisions] = useState('');

  const handleSubmitRevisions = () => {
    // Call the ChatGPT API to submit revisions and update the resume
    onSubmitRevisions(userRevisions);
  };

  return (
    <div className="revision-section">
      <div className="missing-keywords">
        <h3>Missing Keywords</h3>
        <ul>
          {missingKeywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
      <div className="revision-input">
        <h3>Add Details</h3>
        <textarea
          value={userRevisions}
          onChange={(e) => setUserRevisions(e.target.value)}
          placeholder="Add details for each missing keyword or keyphrase."
        />
      </div>
      <button onClick={handleSubmitRevisions}>Submit Revisions</button>
    </div>
  );
}

export default RevisionSection;
