import React, { useState, useEffect } from 'react';
import './VoiceBotiFrame.css';
import { getAuth, getIdToken } from 'firebase/auth';

const VoiceBotIframe = () => {
  const [iframeSrc, setIframeSrc] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      getIdToken(auth.currentUser)
        .then((firebaseAuthToken) => {
          const serverEndpoint = `https://voicebot.ispeakwell.ca/get-html?authToken=${firebaseAuthToken}`;
          setIframeSrc(serverEndpoint);
        })
        .catch((error) => {
          console.error('Error getting ID token:', error);
        });
    }
  }, []);

  return (
    <div id="wrap">
      <div
        className={`tooltip ${showTooltip ? 'show-tooltip' : ''}`}
      >
        Double-click to speak or repeat, then click next or last buttons.
      </div>
      <iframe
        id="theBot"
        src={iframeSrc}
        title="VoiceBot"
        allow="microphone"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      ></iframe>
    </div>
  );
};

export default VoiceBotIframe;
