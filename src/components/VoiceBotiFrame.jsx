import React, { useState, useEffect } from 'react';
import "./VoiceBotiFrame.css";

const VoiceBotIframe = () => {
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    // Set the iframe src once when the component mounts
    setIframeSrc(`https://www.ispeakwell.ca/?version=${new Date().getTime()}`);
  }, []);

  return (
    <div id="wrap">
      <iframe 
        id="theBot"
        src={iframeSrc}
        title="VoiceBot"
        allow="microphone"
      ></iframe>
    </div>
  );
};

export default VoiceBotIframe;
