import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function QRScanner() {
  const isFocused = useIsFocused();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleScanned = async (event: any) => {
    if (scanned || !event?.data) return;

    setScanned(true);
    setLoading(true);

    const scannedUID = event.data.trim();

    try {
      if (!scannedUID || scannedUID.length < 20) {
        throw new Error('Invalid QR code. UID is too short or empty.');
      }

      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated.');
      if (scannedUID === currentUser.uid) {
        throw new Error('You cannot add your own card.');
      }

      const docRef = doc(db, 'cards', scannedUID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const contactRef = doc(collection(db, 'cards', currentUser.uid, 'contacts'));
        await setDoc(contactRef, {
          ...data,
          addedAt: serverTimestamp(),
        });

        Alert.alert('Contact Saved', `You added ${data.name} from ${data.company}`);
      } else {
        Alert.alert('No card found', 'That user has not created a card yet.');
      }
    } catch (error: any) {
      Alert.alert('Error scanning QR', error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setScanned(false), 3000);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}

      {isFocused && permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={handleScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
      ) : (
        <Text style={styles.permissionText}>
          {permission?.granted === false
            ? 'Camera permission is required to scan QR codes.'
            : 'Requesting camera permission...'}
        </Text>
      )}

      <Text style={styles.instruction}>Scan a user QR code to add them</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  instruction: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 50,
    width: '100%',
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#000a',
    padding: 10,
  },
  permissionText: {
    textAlign: 'center',
    color: 'white',
    padding: 20,
    fontSize: 16,
  },
});
