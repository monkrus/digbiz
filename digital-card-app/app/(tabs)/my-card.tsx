import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/auth-context';
import { logout } from '../../utils/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import QRCode from 'react-native-qrcode-svg';

export default function MyCardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleSave = async () => {
    if (!user) return;

    const cardData = {
      fullName,
      jobTitle,
      company,
      phone,
      website,
      bio,
      email: user.email,
      uid: user.uid,
      updatedAt: new Date(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid, 'card', 'info'), cardData);
      Alert.alert('Success', 'Your business card has been saved.');
    } catch (error) {
      console.error('Error saving card:', error);
      Alert.alert('Error', 'Could not save card data.');
    }
  };

  const fetchCard = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'card', 'info');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFullName(data.fullName || '');
        setJobTitle(data.jobTitle || '');
        setCompany(data.company || '');
        setPhone(data.phone || '');
        setWebsite(data.website || '');
        setBio(data.bio || '');
        setEmail(data.email || '');
      }
    } catch (err) {
      console.error('Failed to fetch card', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCard();
  }, []);

  const qrData = JSON.stringify({
    name: fullName,
    email: email,
    phone: phone,
    jobTitle,
    company,
    website,
  });

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading your card…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Business Card</Text>

      <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput placeholder="Job Title" value={jobTitle} onChangeText={setJobTitle} style={styles.input} />
      <TextInput placeholder="Company" value={company} onChangeText={setCompany} style={styles.input} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      <TextInput placeholder="Website" value={website} onChangeText={setWebsite} keyboardType="url" autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Short Bio" value={bio} onChangeText={setBio} multiline style={[styles.input, { height: 80 }]} />

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
      </View>

      <View style={styles.qrContainer}>
        <Text style={styles.qrLabel}>Your QR Code:</Text>
        <QRCode value={qrData} size={180} />
      </View>

      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  buttonContainer: { marginVertical: 16 },
  qrContainer: { alignItems: 'center', marginVertical: 20 },
  qrLabel: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
});
