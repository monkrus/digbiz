// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { observeUser } from "@/lib/auth";

function AuthProvider() {
  const segments = useSegments(); // e.g. ["auth"] or ["main"]
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<null | { uid: string }>(null);

  useEffect(() => {
    const unsub = observeUser((u) => {
      setUser(u ? { uid: u.uid } : null);
      setReady(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inAuth = segments[0] === "auth";
    if (!user && !inAuth) router.replace("/auth/login");
    if (user && inAuth) router.replace("/main");
  }, [ready, user, segments, router]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  // No <Stack /> here — avoid multiple navigators
  return <AuthProvider />;
}
