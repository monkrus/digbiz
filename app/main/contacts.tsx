// app/main/contacts.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type Contact = {
  id: string;
  snapshot?: any;
  name?: string;
  company?: string;
  email?: string;
  tags?: string[];
  createdAt?: number;
};

export default function ContactsScreen() {
  const uid = auth.currentUser?.uid;
  const [loading, setLoading] = useState(true);
  const [qText, setQText] = useState("");
  const [items, setItems] = useState<Contact[]>([]);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "contacts", uid, "items"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const out: Contact[] = [];
      snap.forEach((d) => out.push({ id: d.id, ...(d.data() as any) }));
      setItems(out);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  const filtered = useMemo(() => {
    const ql = qText.trim().toLowerCase();
    if (!ql) return items;
    return items.filter((c) =>
      [c.name, c.company, c.email, ...(c.tags ?? [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(ql))
    );
  }, [qText, items]);

  if (!uid) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Please sign in.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>Contacts</Text>
      <TextInput
        placeholder="Search by name, company, email or tag"
        value={qText}
        onChangeText={setQText}
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 8 }}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontWeight: "600" }}>{item.name ?? "(no name)"}</Text>
              {!!item.company && <Text>{item.company}</Text>}
              {!!item.email && <Text style={{ color: "#555" }}>{item.email}</Text>}
              {!!item.tags?.length && (
                <Text style={{ marginTop: 4, fontSize: 12, color: "#777" }}>
                  {item.tags.join(" • ")}
                </Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
