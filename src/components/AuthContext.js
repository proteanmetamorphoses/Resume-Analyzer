import React, { createContext, useState, useContext } from 'react';

// Create a context
const AuthContext = createContext();

// This context provider is used to encapsulate your app
export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null);

  // The value that will be given to the context
  const authContextValue = {
    userRole,
    setUserRole,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

// Custom hook that shorthands the context!
export const useAuth = () => useContext(AuthContext);
