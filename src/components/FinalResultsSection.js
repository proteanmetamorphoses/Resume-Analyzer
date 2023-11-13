import React from 'react';
import './FinalResultsSection.css';


function FinalResultsSection({ finalResume, newEmployabilityScore, coverLetter }) {
  const handleSave = () => {

  };

  const handleDownload = () => {

  };

  return (
    <div className="final-results-section">
      <div>
        <h3>Revised Resume</h3>
        <div className="revised-resume">
          {finalResume.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
      <h3 className="ats-score-header">Revised ATS Score</h3> 
      <h3 className="revised-ats-score">
        {newEmployabilityScore}
      </h3>
      <div>
          <h3 className="cover-letter-header">Cover Letter</h3>
          <div className="cover-letter">
            {coverLetter.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
}

export default FinalResultsSection;
