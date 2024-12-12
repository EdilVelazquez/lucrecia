import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDgbWDk7P0RXiptCYsVbvjGh_TIdFWklJQ",
  authDomain: "lucreciafloreria.firebaseapp.com",
  projectId: "lucreciafloreria",
  storageBucket: "lucreciafloreria.firebasestorage.app",
  messagingSenderId: "1094764293774",
  appId: "1:1094764293774:web:57d0ae23d2dc4d86c8a3df",
  measurementId: "G-JQR8JM17EM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);