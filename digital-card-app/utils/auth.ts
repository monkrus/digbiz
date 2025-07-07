// digital-card-app/utils/auth.ts
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';


/**
 * Login with Firebase Auth
 */
export async function loginWithEmailPassword(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Register a new user with email and password
 */
export async function createUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Logout from Firebase Auth
 */
export async function logout() {
  await signOut(auth);
}

