// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2FP_dEB33hLGEv9bDQA0baTKq-biRiCY",
  authDomain: "gen-lang-client-0298920077.firebaseapp.com",
  projectId: "gen-lang-client-0298920077",
  storageBucket: "gen-lang-client-0298920077.firebasestorage.app",
  messagingSenderId: "453447348777",
  appId: "1:453447348777:web:8cc3b9c6a9fb3e20af2238",
  measurementId: "G-R7F5D2HNJZ"
};

// Next.js fix: Ensure Firebase doesn't initialize twice during hot reloads
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Analytics only runs in the browser
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

// Export the app and any services for use in your components
export { app, analytics };
// export const auth = getAuth(app);