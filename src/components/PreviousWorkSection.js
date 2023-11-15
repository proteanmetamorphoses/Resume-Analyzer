import './PreviousWorkSection.css';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../utils/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

function UserDocuments() {
  const [documents, setDocuments] = useState([]);
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
          console.log(docs);
        } catch (error) {
          console.error("Error fetching documents: ", error);
        }
      } else {
        // User is not logged in or has logged out.
        setDocuments([]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : documents.length > 0 ? (
        <div className="documents-container"> {/* Flex container */}
          {documents.map((doc) => (
            <div key={doc.id} className="document-container">
              <h3>{doc.title}</h3>
              <p className="eScore">Employability Score: {doc.newEmployabilityScore}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="noDocs">No resumes found.</p>
      )}
    </div>
  );
}

export default UserDocuments;
