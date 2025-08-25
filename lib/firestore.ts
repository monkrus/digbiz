import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile } from "./types";

function userDoc(uid?: string) {
  const id = uid ?? auth.currentUser?.uid;
  if (!id) throw new Error("No current user");
  return doc(db, "users", id);
}

export async function loadProfile(): Promise<UserProfile | null> {
  const snap = await getDoc(userDoc());
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveProfile(p: UserProfile) {
  const ref = userDoc(p.uid);
  await setDoc(
    ref,
    { ...p, updatedAt: Date.now(), _serverUpdatedAt: serverTimestamp() },
    { merge: true }
  );
}
