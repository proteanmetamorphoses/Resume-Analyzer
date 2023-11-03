// KeywordsList.js
import React from 'react';

const KeywordsList = ({ keywords, type }) => {
  return (
    <div>
      <h3>{type === 'resume' ? 'Resume Keywords' : 'Job Description Keywords'}</h3>
      <ul>
        {keywords && keywords.map((keyword, index) => <li key={index}>{keyword}</li>)}
      </ul>
    </div>
  );
};

export default KeywordsList;
