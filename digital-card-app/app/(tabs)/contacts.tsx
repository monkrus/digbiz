import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '@/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>{item.email}</Text>
            <Text style={styles.info}>{item.phone}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No contacts found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  empty: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 40,
    textAlign: 'center',
  },
});
