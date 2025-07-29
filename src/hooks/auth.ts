import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../config/firebase";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsEmailVerified(user ? user.emailVerified : false);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading, isEmailVerified };
};

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
      setError("Passwörter stimmen nicht überein");
      return { userCredential: null, emailExists: false };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      console.log(
        "Signed up and verification email sent:",
        userCredential.user
      );
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

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
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
      setLoading(false);
    }
  };

  return { login, error, loading };
};

export const useSendVerificationEmail = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendVerificationEmail = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        console.log("Verification email sent");
      } else {
        setError("Kein Benutzer eingeloggt");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendVerificationEmail, error, loading };
};

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
