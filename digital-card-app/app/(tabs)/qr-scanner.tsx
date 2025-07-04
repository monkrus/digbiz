import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return; // Prevent multiple scans
    
    setScanned(true);
    try {
      const parsed = JSON.parse(data);
      Alert.alert(
        'Contact Scanned',
        `Name: ${parsed.name}\nEmail: ${parsed.email}\nPhone: ${parsed.phone}`,
        [
          { text: 'OK', onPress: () => setScanned(false) }
        ]
      );
    } catch {
      Alert.alert(
        'Invalid QR Code', 
        'This QR code does not contain valid contact info.',
        [
          { text: 'OK', onPress: () => setScanned(false) }
        ]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera.</Text>
        <Button 
          title="Request Permission" 
          onPress={() => Camera.requestCameraPermissionsAsync()} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          facing="back"
        />
      )}
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
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});