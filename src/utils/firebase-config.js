// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAuth} from 'firebase/auth';
import { ref} from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNNK36LKkNT774-Yod5jWIDZ2zjSnLtvA",
  authDomain: "scissor-49c82.firebaseapp.com",
  projectId: "scissor-49c82",
  storageBucket: "scissor-49c82.appspot.com",
  messagingSenderId: "746968039339",
  appId: "1:746968039339:web:641fe97e592c5e05451cee",
  measurementId: "G-C0KQ0J7FN9"
};

// Initialized Firebase
const app = initializeApp(firebaseConfig);

// Initialized services
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const firebaseDatabase = getDatabase();
const getStatsByLinkId = (linkId) => {
  const statsRef = ref(firebaseDatabase, `stats/${linkId}`);
  return statsRef;
};


// Export for use in other parts of the app
export { db, auth, analytics, app, firebaseDatabase, getStatsByLinkId  };