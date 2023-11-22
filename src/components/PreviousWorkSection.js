// PreviousWorkSection.js
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../utils/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import "./PreviousWorkSection.css";

function PreviousWorkSection({ documents, setDocuments, onDocumentClick }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "users", user.uid, "documents"));
          const querySnapshot = await getDocs(q);
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          setDocuments(docs);
        } catch (error) {
          console.error("Error fetching documents: ", error);
        }
      } else {
        setDocuments([]);
      }
      setLoading(false);
    });
  }, [setDocuments]);

  const handleDocumentClick = (document) => {
    onDocumentClick(document.finalResume, document.coverLetter, document.id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {documents.length > 0 ? (
        <div className="documents-container">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="document-container"
              onClick={() => handleDocumentClick(doc)}
            >
              <div className="document-info">
                <h3>{doc.title}</h3>
                <p className="eScore">Fit: {doc.newEmployabilityScore}%</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="noDocs">No resumes found.</p>
          <p className="noDocs">Start working below.</p>
        </div>
      )}
    </div>
  );
}

export default PreviousWorkSection;
