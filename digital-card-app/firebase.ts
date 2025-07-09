// digital-card-app/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyArK5M_7Eg_k5oPIAFnLDv_nczqtS_GwXw",
  authDomain: "digital-card-app-64826.firebaseapp.com",
  projectId: "digital-card-app-64826",
  storageBucket: "digital-card-app-64826.appspot.com",
  messagingSenderId: "172171635684",
  appId: "1:172171635684:web:d08ba9bb4fe77a07e535f1"
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
  app = null;
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
