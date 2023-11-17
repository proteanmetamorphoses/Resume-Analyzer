// PreviousWorkSection.js
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../utils/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import DocumentModal from './DocumentModal'; 
import './PreviousWorkSection.css';


function PreviousWorkSection({ onDocumentClick }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);

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
  }, []);

  const handleDocumentClick = (document) => {
    onDocumentClick(document.finalResume, document.coverLetter);
  };

  const closeModal = () => {
    setSelectedDocument(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : documents.length > 0 ? (
        <div className="documents-container">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="document-container"
              onClick={() => handleDocumentClick(doc)}
            >
              <div className="document-info">
                <h3>{doc.title}</h3>
                <p className="eScore">Employability Score: {doc.newEmployabilityScore}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="noDocs">No resumes found.  Start adding one, below...</p>
      )}

      {selectedDocument && (
        <DocumentModal
          coverLetter={selectedDocument.coverLetter}
          resume={selectedDocument.finalResume}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default PreviousWorkSection;