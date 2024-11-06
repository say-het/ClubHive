import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAW4LlpHIGxvHkCjvKraZ4DZRiLEs7PYqE",
  authDomain: "mystery-9dd4b.firebaseapp.com",
  projectId: "mystery-9dd4b",
  storageBucket: "mystery-9dd4b.firebasestorage.app",
  messagingSenderId: "406176490090",
  appId: "1:406176490090:web:c3efec3eeda693c813e013",
  measurementId: "G-Y26TRPVJSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
