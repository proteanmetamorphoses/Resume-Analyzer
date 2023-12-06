import React, { useState, useEffect } from 'react';
import './VoiceBotiFrame.css';
import { getAuth, getIdToken } from 'firebase/auth';

const VoiceBotIframe = () => {
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    // Initialize Firebase Authentication
    const auth = getAuth();

    // Check if the user is currently authenticated
    if (auth.currentUser) {
      // Get the user's Firebase authentication token
      getIdToken(auth.currentUser)
        .then((firebaseAuthToken) => {
          console.log('Firebase Auth Token:', firebaseAuthToken); 

          // Directly set the iframe source to your server endpoint
          // Update the endpoint as needed to match your server configuration
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

/* old code pre-API

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

export default VoiceBotIframe; */