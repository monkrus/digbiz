import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function QRScannerScreen() {
  const [scanned, setScanned] = useState(false);
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  // Simplified permission handling - directly use cameraPermission
  const hasPermission = cameraPermission?.granted;

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    
    try {
      // Parse JSON
      const parsed = JSON.parse(data);
      const { name, email, phone } = parsed;

      // Validate required fields
      if (!name || !email || !phone) {
        throw new Error('Missing required contact information');
      }

      // Save to Firebase
      await addDoc(collection(db, 'contacts'), { 
        name: name.trim(), 
        email: email.trim(), 
        phone: phone.trim() 
      });

      Alert.alert(
        'Contact Saved',
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } catch (error) {
      let errorMessage = 'This QR code does not contain valid contact info.';
      
      // More specific error handling
      if (error instanceof SyntaxError) {
        errorMessage = 'QR code contains invalid data format.';
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        (error as { message?: string }).message === 'Missing required contact information'
      ) {
        errorMessage = 'QR code is missing required contact fields (name, email, phone).';
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: string }).code === 'string' &&
        (error as { code?: string }).code?.startsWith('firestore/')
      ) {
        errorMessage = 'Failed to save contact. Please try again.';
      }

      Alert.alert(
        'Invalid QR Code',
        errorMessage,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  };

  // Handle loading state
  if (cameraPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }

  // Handle permission denied
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
      
      {/* Overlay for better UX */}
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
  container: { 
    flex: 1,
    backgroundColor: 'black',
  },
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