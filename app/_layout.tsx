import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ProfileProvider } from '@/context/ProfileContext';
import AuthGate from '@/components/AuthGate';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ProfileProvider>
      <AuthGate />
      <StatusBar style="auto" />
    </ProfileProvider>
  );
}