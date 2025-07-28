import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import { initializeAuth, Auth } from "firebase/auth";
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

// Firebase config from .env
const firebaseConfig: FirebaseConfig = {
  apiKey: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app only once
let app: FirebaseApp;
try {
  app = getApp(); // Try to get existing app
} catch {
  app = initializeApp(firebaseConfig); // Initialize if no app exists
}

// Initialize Auth (no persistence for now due to Firebase JS SDK limitation)
let auth: Auth;
try {
  auth = initializeAuth(app); // Try to get existing auth instance
} catch {
  auth = initializeAuth(app, { persistence: null }); // Initialize with no persistence
}

export { app, auth };
export type { FirebaseApp, Auth };
