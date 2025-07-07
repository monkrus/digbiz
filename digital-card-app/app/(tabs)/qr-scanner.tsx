// digital-card-app/app/(tabs)/qr-scanner.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../hooks/auth-context';

export default function QRScannerScreen() {
  const { user } = useAuth();
  const [scanned, setScanned] = useState(false);
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  const hasPermission = cameraPermission?.granted;

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !user) return;

    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      const { name, email, phone } = parsed;

      if (!name || !email || !phone) {
        throw new Error('Missing required contact information');
      }

      await addDoc(collection(db, 'users', user.uid, 'contacts'), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        scannedAt: new Date(),
      });

      Alert.alert(
        'Contact Saved',
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } catch (error) {
      let errorMessage = 'This QR code does not contain valid contact info.';

      if (error instanceof SyntaxError) {
        errorMessage = 'QR code contains invalid data format.';
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        (error as { message?: string }).message === 'Missing required contact information'
      ) {
        errorMessage = 'QR code is missing required fields (name, email, phone).';
      }

      Alert.alert('Invalid QR Code', errorMessage, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (cameraPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          Camera access is required to scan QR codes.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
      )}

      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instructionText}>
          Point your camera at a QR code to scan
        </Text>
      </View>

      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
