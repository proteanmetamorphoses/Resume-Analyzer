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
      <h2>Your Documents</h2>
      {documents.length > 0 ? (
        documents.map((doc) => (
          <div key={doc.id}>
            <h3>{doc.title}</h3> {/* Display the title */}
            <p>Employability Score: {doc.newEmployabilityScore}</p> {/* Display the score */}
          </div>
        ))
      ) : (
        <p>No documents found.</p>
      )}
    </div>
  );
}

export default UserDocuments;
