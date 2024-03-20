import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";

// Replace this with your Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

// Function to add a document to a Firestore collection
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; 
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; 
  }
};

// Function to get all documents from a Firestore collection
const getCollectionDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return documents;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// Function to set up real-time listener for a Firestore collection
const listenToCollectionChanges = (collectionName, callback) => {

  const q = query(collection(db, collectionName), orderBy('timestamp', 'desc')); 
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const updatedDocuments = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .slice(0, 10); 
    callback(updatedDocuments.reverse());
  });
  
  return unsubscribe;
};

export { db, addDocument, listenToCollectionChanges };
// export { db, addDocument, getCollectionDocuments };
