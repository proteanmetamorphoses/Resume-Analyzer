import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create a context
const AuthContext = createContext();

// This context provider is used to encapsulate your app
export function AuthProvider({ children }) {
  // Initialize userRole state with value from local storage
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Whenever userRole changes, update it in local storage
  useEffect(() => {
    if (userRole) {
      sessionStorage.setItem('userRole', userRole);
    } else {
      sessionStorage.removeItem('userRole');
    }
  }, [userRole]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });

    return unsubscribe; // Unsubscribe on unmount
  }, []);

  const authContextValue = {
    userRole,
    setUserRole,
    currentUser,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

// Custom hook that shorthands the context
export const useAuth = () => useContext(AuthContext);
