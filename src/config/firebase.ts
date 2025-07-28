import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import { initializeAuth, Auth, getReactNativePersistence } from "firebase/auth"; // <-- This is where it should come from for RN in v10+

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";

// Define the shape of the Firebase config
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase config from .env (ensure these are correctly populated in your app.config.js/app.json extras)
const firebaseConfig: FirebaseConfig = {
  apiKey: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app only once
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // If an app already exists, get it
}

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth };
export type { FirebaseApp, Auth };