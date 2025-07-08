import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const contactsRef = collection(db, 'users', user.uid, 'scannedContacts');
        const snapshot = await getDocs(contactsRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading contacts...</Text>
      </View>
    );
  }

  if (contacts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No contacts found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
          <Text>{item.title}</Text>
          <Text>{item.company}</Text>
          <Text>{item.phone}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
});
