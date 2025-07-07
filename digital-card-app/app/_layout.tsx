// digital-card-app/app/_layout.tsx
import { Slot } from 'expo-router';
import { AuthProvider } from '../hooks/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
