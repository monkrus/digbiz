// lib/firebase.ts
import { Platform } from "react-native";
import Constants from "expo-constants";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FirebaseExtra = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
};

// Read from app.config.ts -> extra.firebase
const firebaseConfig =
  (Constants.expoConfig?.extra?.firebase as FirebaseExtra) ??
  (Constants.manifest2?.extra?.firebase as FirebaseExtra);

if (!firebaseConfig?.apiKey || !firebaseConfig?.projectId || !firebaseConfig?.appId) {
  console.warn("Firebase config is missing. Did you set .env and app.config.ts?");
}

// Single app instance
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth: on native, we must use initializeAuth with AsyncStorage persistence
let auth = getAuth(app);
if (Platform.OS !== "web") {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth throws if called twice — ignore on fast refresh
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

/** Promise that resolves once Firebase reports the current user (or null). */
export const getCurrentUser = (): Promise<User | null> =>
  new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((u) => {
      resolve(u);
      unsub();
    });
  });

export { app, auth, db, storage };
