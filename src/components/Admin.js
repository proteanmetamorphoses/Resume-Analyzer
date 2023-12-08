import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./Admin.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    if (user) {
      async function fetchQuestions() {
        const response = await fetch("/data/questions.csv");
        const reader = response.body.getReader();
        const result = await reader.read(); // raw array
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value); // the CSV text
        Papa.parse(csv, {
          complete: (result) => {
            setQuestions(result.data.flat());
          },
          header: false
        });
      }

      fetchQuestions();
    }
  }, [user]);

  if (!user) {
    return <div>Loading or not authorized...</div>;
  }

  return (
    <div className="admin-section">
      {questions.map((question, index) => (
        <div key={index} className="question">
          {question}
        </div>
      ))}
    </div>
  );
}

export default Admin;
