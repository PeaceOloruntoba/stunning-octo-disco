// hooks/userProfile.ts
import { useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { User } from "firebase/auth";

export interface UserProfile {
  participatedEvents: any[];
  favoriteEventIds: any[];
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // Storing as ISO string (YYYY-MM-DD)
  gender?: string; // 'male', 'female', 'prefer_not_to_say'
  newsletter?: boolean;
  datenschutzAccepted?: boolean;
  preferences?: {
    categories: string[];
    subcategories: { [key: string]: string[] };
  };
  // Add other profile fields here as needed
}

export const useUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const createUserProfile = async (
    user: User,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    gender: string,
    newsletter: boolean,
    datenschutzAccepted: boolean
  ): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);
    try {
      const userRef = doc(db, "users", user.uid);
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        dateOfBirth: dateOfBirth.toISOString().split("T")[0], // Store as YYYY-MM-DD
        gender,
        newsletter,
        datenschutzAccepted,
        favoriteEventIds: [],
        participatedEvents: []
      };
      await setDoc(userRef, newProfile, { merge: true }); // Use merge to avoid overwriting existing fields
      setProfile(newProfile);
      console.log("User profile created/updated:", newProfile);
      return newProfile;
    } catch (err) {
      setError((err as Error).message);
      console.error("Error creating user profile:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        return data;
      } else {
        setProfile(null);
        return null;
      }
    } catch (err) {
      setError((err as Error).message);
      console.error("Error fetching user profile:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (
    uid: string,
    updates: Partial<UserProfile>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, updates);
      setProfile((prev) => (prev ? { ...prev, ...updates } : null)); // Optimistic update
      console.log("User profile updated:", updates);
      return true;
    } catch (err) {
      setError((err as Error).message);
      console.error("Error updating user profile:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    profile,
    loading,
    error,
  };
};
