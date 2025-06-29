import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function MyCardScreen() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const cardData = JSON.stringify({ name, title, company, email, phone, linkedin });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Digital Card</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Company" value={company} onChangeText={setCompany} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="LinkedIn URL" value={linkedin} onChangeText={setLinkedin} />

      <View style={styles.preview}>
        <Text style={styles.cardText}>{name}</Text>
        <Text style={styles.cardText}>{title}</Text>
        <Text style={styles.cardText}>{company}</Text>
        <Text style={styles.cardText}>{email}</Text>
        <Text style={styles.cardText}>{phone}</Text>
        <Text style={styles.cardText}>{linkedin}</Text>
      </View>

      <Text style={styles.qrLabel}>Your QR Code:</Text>
      <QRCode value={cardData || ' '} size={200} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  preview: { marginTop: 20, marginBottom: 20, width: '100%', backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10 },
  cardText: { fontSize: 16, marginBottom: 5 },
  qrLabel: { fontSize: 18, marginBottom: 10 },
});
