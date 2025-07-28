// hooks/auth.ts
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";

// Hook for authentication state
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

// Hook for signup
export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{
    userCredential: UserCredential | null;
    emailExists: boolean;
  }> => {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return { userCredential: null, emailExists: false };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Signed up:", userCredential.user);
      return { userCredential, emailExists: false };
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError(
          "Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an."
        );
        return { userCredential: null, emailExists: true };
      }
      setError(err.message);
      return { userCredential: null, emailExists: false };
    }
  };

  return { signup, error };
};

// Hook for login
export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true); // Set loading true
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in:", userCredential.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // Set loading false
    }
  };

  return { login, error, loading }; // Export loading
};

// Hook for logout
export const useLogout = () => {
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      console.log("Logged out");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return { logout, error };
};
