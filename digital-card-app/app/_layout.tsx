import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust path if needed
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)/my-card'); // User is signed in → main tabs
      } else {
        router.replace('/login'); // Not signed in → login screen
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
