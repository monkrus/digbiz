import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/** Opens the gallery and returns the selected image URI (or null). */
export async function pickImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") return null;

  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0].uri ?? null;
}

/** Uploads a local (file:/data:/blob:) image to Storage and returns a download URL. */
export async function uploadImageAsync(localUri: string, path: string): Promise<string> {
  const resp = await fetch(localUri);
  const blob = await resp.blob();
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, blob, { contentType: blob.type || "image/jpeg" });
  return getDownloadURL(fileRef);
}
