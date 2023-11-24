import { db } from "../utils/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";

const checkDocumentsExist = async (userId, titleToCheck) => {
  try {
    const q = query(collection(db, "users", userId, "documents"), where("title", "==", titleToCheck));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Return true if documents with the specified title exist, false otherwise
  } catch (error) {
    console.error("Error checking documents: ", error);
    return false; // Handle errors gracefully
  }
};

export default checkDocumentsExist;
