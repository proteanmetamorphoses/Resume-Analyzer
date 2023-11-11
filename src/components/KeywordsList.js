// KeywordsList.js
import React from 'react';
import './KeywordsList.css';

const KeywordsList = ({ keywords, type }) => {
  return (
    <div>
      <h3 className="keyTitles">{type === 'resume' ? 'Resume Keywords' : 'Job Description Keywords'}</h3>
      <div className="keywords">
        <ul>
          {keywords && keywords.map((keyword, index) => <li key={index}>{keyword}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default KeywordsList;
