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
    <div className="Previous-Resume-Work">
      {documents.length > 0 ? (
        <div className="documents-container">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="document-container"
              onClick={() => handleDocumentClick(doc)}
            >
              <div className="tab"></div>
              <div className="document-info">
                <h3 className="documentTitle">{doc.title}</h3>
                <h3 className="eScore">Fit: {doc.newEmployabilityScore}%</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3 className="noDocs">No resumes found.</h3>
          <h3 className="noDocs">Start working below.</h3>
        </div>
      )}
    </div>
  );
  
}

export default PreviousWorkSection;
