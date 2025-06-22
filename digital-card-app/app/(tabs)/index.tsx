import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DigiBiz 👋</Text>
      <Text style={styles.subtitle}>Start by creating your business card.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/create')}>
        <Text style={styles.buttonText}>Create Card</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/scan')}>
        <Text style={styles.buttonText}>Scan QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/contacts')}>
        <Text style={styles.buttonText}>View Contacts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  title: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 10
  },
  subtitle: {
    fontSize: 16, color: '#666', marginBottom: 30
  },
  button: {
    backgroundColor: '#007aff', padding: 15, borderRadius: 10, marginVertical: 10, width: '80%', alignItems: 'center'
  },
  buttonText: {
    color: '#fff', fontSize: 16, fontWeight: 'bold'
  }
});
