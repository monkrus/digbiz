import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase'; // ✅ adjust if needed based on new firebase.ts location
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Firestore access test
  useEffect(() => {
    if (!db) {
      console.log('Firestore not initialized');
      return;
    }
    // Test write
    setDoc(doc(db, "test", "testDoc"), { hello: "world" })
      .then(() => console.log("Firestore write success"))
      .catch((e) => console.log("Firestore write error", e));

    // Test read
    getDoc(doc(db, "test", "testDoc"))
      .then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Firestore read success", docSnap.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch((e) => console.log("Firestore read error", e));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false); // ✅ set this BEFORE navigating
      if (user) {
        router.replace('/(tabs)/my-card'); // ✅ Main screen after login
      } else {
        router.replace('/login'); // ✅ Redirect to login screen
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
