// app/main/share.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { auth } from "../../lib/firebase";
import QRCode from "react-qr-code";

export default function ShareScreen() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    setUid(auth.currentUser?.uid ?? null);
  }, []);

  if (!uid) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ fontSize: 16, color: "#333" }}>You must be signed in to share your card.</Text>
      </View>
    );
  }

  const qrValue = `https://yourapp.com/u/${uid}`; // you can customize the prefix

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Share My Card</Text>
      <Text style={{ fontSize: 14, color: "#555", textAlign: "center" }}>
        Let others scan this QR code to add you to their contacts
      </Text>
      <View style={{ backgroundColor: "white", padding: 16, borderRadius: 12 }}>
        {qrValue ? (
          <QRCode value={qrValue} size={220} />
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </View>
  );
}
