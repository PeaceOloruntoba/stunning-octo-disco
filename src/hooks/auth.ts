import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase"; // Import pre-initialized auth

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
  const [signupUserCredential, setSignupUserCredential] = useState<UserCredential | null>(null);

const signup = async (
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<UserCredential | null> => { // Specify return type
    setError(null);
    setSignupUserCredential(null); // Clear previous result
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return null; // Return null on error
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Signed up:", userCredential.user);
      setSignupUserCredential(userCredential); // Store the credential
      return userCredential; // Return the userCredential on success
    } catch (err) {
      setError((err as Error).message);
      return null; // Return null on error
    }
  };

  return { signup, error, signupUserCredential  };
};

// Hook for login
export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in:", userCredential.user);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return { login, error };
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
