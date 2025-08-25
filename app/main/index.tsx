// app/main/index.tsx
import { View, Text, Button } from "react-native";
import { auth } from "../../lib/firebase";
import { signOut } from "../../lib/auth";
import { Link } from "expo-router";

export default function Home() {
  const user = auth.currentUser;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>
        {user
          ? `Logged in as: ${user.email ?? "unknown"} (UID: ${user.uid})`
          : "Not signed in"}
      </Text>

      <Link href="/main/my-card" style={{ color: "#007AFF", fontSize: 16 }}>
        Go to My Card
      </Link>

      <Link href="/main/contacts" style={{ color: "#007AFF", fontSize: 16 }}>
        View Contacts
      </Link>

      <Link href="/main/scan" style={{ color: "#007AFF", fontSize: 16 }}>
        Scan a QR
      </Link>

      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}
