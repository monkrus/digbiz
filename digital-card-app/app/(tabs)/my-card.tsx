import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function MyCardScreen() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('my.email@example.com');
  const [phone, setPhone] = useState('+1 123 456 7890');
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });

  const validateFields = () => {
    const newErrors: any = { name: '', email: '', phone: '' };

    if (!/^[a-zA-Z\s]{2,}$/.test(name)) {
      newErrors.name = 'Name must be at least 2 letters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!/^[0-9+\s\-]{7,15}$/.test(phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const contactInfo = JSON.stringify({ name, email, phone });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Digital Business Card</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        <Text style={styles.label}>Phone</Text>
        <TextInput
          placeholder="Enter your phone number"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}
      </View>

      <View style={styles.qrContainer}>
        {validateFields() ? (
          <>
            <QRCode value={contactInfo} size={200} />
            <Text style={styles.qrLabel}>Scan this to save your contact</Text>
          </>
        ) : (
          <Text style={styles.error}>Please fix the errors above to generate your QR.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#f3f3f3',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 10,
  },
  qrContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  qrLabel: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});
