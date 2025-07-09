import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function MyCardScreen() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setEmail(user.email || '');

    const fetchCard = async () => {
      try {
        const docRef = doc(db, 'cards', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setTitle(data.title || '');
          setCompany(data.company || '');
        }
        setLoading(false);
      } catch (error: any) {
        Alert.alert('Error loading card', error.message);
        setLoading(false);
      }
    };

    fetchCard();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await setDoc(doc(db, 'cards', user.uid), {
        name,
        title,
        company,
        email: user.email,
      });
      Alert.alert('Saved', 'Your card has been saved.');
    } catch (error: any) {
      Alert.alert('Save Failed', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading your card...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.userInfo}>Logged in as: {email}</Text>
      <Button title="Log Out" onPress={handleLogout} color="red" />

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Company" value={company} onChangeText={setCompany} />

      <Button title="Save Card" onPress={handleSave} />

      <View style={styles.qrContainer}>
        <QRCode value={`${name}|${title}|${company}`} size={200} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 5 },
  qrContainer: { alignItems: 'center', marginTop: 20 },
  userInfo: { marginBottom: 10, fontWeight: 'bold' },
});
