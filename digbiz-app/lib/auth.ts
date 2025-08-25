import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  User,
} from "firebase/auth";

// Map Firebase errors to friendly messages
export const mapAuthError = (code?: string): string => {
  switch (code) {
    case "auth/invalid-email": return "Invalid email address.";
    case "auth/user-disabled": return "Account is disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password": return "Email or password is incorrect.";
    case "auth/email-already-in-use": return "Email already in use.";
    case "auth/weak-password": return "Password is too weak.";
    case "auth/network-request-failed": return "Network error, try again.";
    default: return "Something went wrong. Please try again.";
  }
};

export const signUpEmail = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const signInEmail = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const signOut = () => fbSignOut(auth);

/** Subscribe to auth state; returns unsubscribe */
export const observeUser = (cb: (u: User | null) => void) => onAuthStateChanged(auth, cb);

/** Google sign-in using OAuth tokens (wire in Step C.2) */
export const signInWithGoogleCredential = async (idToken: string) => {
  const provider = new GoogleAuthProvider();
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
};
