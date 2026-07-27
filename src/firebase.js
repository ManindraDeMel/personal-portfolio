// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Web app config is public by design (it ships in every client bundle and is
// served by Firebase Hosting at /__/firebase/init.json). Hardcoded fallbacks
// keep Firestore working when the CI build has no env secrets — same approach
// as the EmailJS client IDs. Env vars still win when present.
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDhz9BP9KUkM3atvLqCguXUfF_y2AhLQ5s',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'manindra-portfolio.firebaseapp.com',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'manindra-portfolio',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'manindra-portfolio.firebasestorage.app',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '544958399086',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:544958399086:web:e7d3886dbea111c5e71c7f',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
