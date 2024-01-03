// TokenContext.js
import React, { createContext, useState } from 'react';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState(0);

  return (
    <TokenContext.Provider value={{ tokens, setTokens }}>
      {children}
    </TokenContext.Provider>
  );
};
