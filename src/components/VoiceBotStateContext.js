import React, { createContext, useState } from 'react';

export const VoiceBotStateContext = createContext();

const initialState = {
    audioFileIndex: 0, // Index of the current audio file
    isListening: false, // Boolean to track if voice recognition is active
    voiceBotText: "", // Text of the VoiceBot
    sentences: [], // Array of sentences
    combinedText: "", // Combined text of interviewer and user
    prevCombinedText: "", // Previous combined text
  };
  

export const VoiceBotStateProvider = ({ children }) => {
  const [voiceBotState, setVoiceBotState] = useState(initialState);

  return (
    <VoiceBotStateContext.Provider value={{ voiceBotState, setVoiceBotState }}>
      {children}
    </VoiceBotStateContext.Provider>
  );
};
