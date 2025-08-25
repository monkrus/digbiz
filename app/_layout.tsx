// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { observeUser } from "../lib/auth";

export default function RootLayout() {
  return <AuthProvider />;
}

function AuthProvider() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = observeUser((u) => {
      setIsAuthed(!!u);
      setReady(true); // only after Firebase reports user/null
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inAuth = segments[0] === "auth";
    if (!isAuthed && !inAuth) router.replace("/auth/login");
    if (isAuthed && inAuth) router.replace("/main");
  }, [ready, isAuthed, segments, router]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Slot />;
}
