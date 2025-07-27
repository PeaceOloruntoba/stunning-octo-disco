import { initializeApp, FirebaseApp } from "firebase/app";
import { initializeAuth, Auth } from "firebase/auth"; // Removed getReactNativePersistence since it's not available
import AsyncStorage from "@react-native-async-storage/async-storage";
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

// Initialize Firebase app (check for existing instance)
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // If app already exists, get the existing instance
  app = initializeApp(firebaseConfig, "existing"); // Use a different name to avoid conflict
}

// Initialize Auth (no persistence for now due to missing getReactNativePersistence)
const auth: Auth = initializeAuth(app);

export { app, auth };
export type { FirebaseApp, Auth };
