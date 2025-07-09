import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // ✅ adjust if needed based on new firebase.ts location
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
