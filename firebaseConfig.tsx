// firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1lpVFcnakMQgj_9ckuLqtisuzEJiBopY",
  authDomain: "ulavtechapp.firebaseapp.com",
  projectId: "ulavtechapp",
  storageBucket: "ulavtechapp.firebasestorage.app",
  messagingSenderId: "680404094581",
  appId: "1:680404094581:web:193f93c77caa8bab36b23c",
  measurementId: "G-DC8XG0TM3P"
};

// Prevent duplicate initialization
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const storage = getStorage(app);