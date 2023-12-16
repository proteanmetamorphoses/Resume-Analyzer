import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './components/AuthContext'; // Import your auth context
import { db } from './utils/firebase'; // Adjust the path as per your project structure
import { doc, onSnapshot } from 'firebase/firestore';

const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState(0);
  const { currentUser } = useAuth(); // Assuming you have a currentUser in your AuthContext

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const colorModeRef = doc(db, "users", currentUser.uid, "userColorMode", "colorDocument");
      const unsubscribe = onSnapshot(colorModeRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setColorMode(data.colorMode || 0);
        } else {
          setColorMode(0);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const changeColorMode = (newColorMode) => {
    setColorMode(newColorMode);
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, changeColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};
