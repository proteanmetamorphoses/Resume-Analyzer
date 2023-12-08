import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or some loading indicator
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
