// app/main/scan.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Expect QR content to be either:
 *  - a plain UID (abc123)
 *  - or a URL like: https://.../u/<uid>
 */
function extractUid(data: string): string | null {
  const trimmed = data.trim();
  if (/^[A-Za-z0-9_-]{6,}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(/\/u\/([A-Za-z0-9_-]+)/);
  return m?.[1] ?? null;
}

export default function ScanScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [processing, setProcessing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ textAlign: "center", marginBottom: 8 }}>
          We need camera permission to scan QR codes.
        </Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isFocused && (
        <Camera
          style={{ flex: 1 }}
          onBarCodeScanned={async ({ data }) => {
            if (processing) return;
            setProcessing(true);
            try {
              const uid = extractUid(data);
              if (!uid) {
                Alert.alert("Invalid QR", "This code doesn't contain a valid user id.");
                return;
              }

              // fetch the profile of scanned user
              const snap = await getDoc(doc(db, "users", uid));
              if (!snap.exists()) {
                Alert.alert("Not found", "User profile was not found.");
                return;
              }

              // save to my contacts
              const me = auth.currentUser?.uid;
              if (!me) {
                Alert.alert("Not signed in", "Please sign in first.");
                return;
              }

              await setDoc(
                doc(db, "contacts", me, "items", uid),
                {
                  cardUid: uid,
                  snapshot: snap.data(),
                  createdAt: serverTimestamp(),
                },
                { merge: true }
              );
              Alert.alert("Saved", "Contact added to your list.");
            } catch (e: any) {
              console.log("Scan save error", e);
              Alert.alert("Error", e?.message ?? "Failed to save contact.");
            } finally {
              // allow another scan after a short pause
              setTimeout(() => setProcessing(false), 1200);
            }
          }}
        />
      )}
    </View>
  );
}
