import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ProfileProvider } from '@/context/ProfileContext';
import AuthGate from '@/components/AuthGate';
import { RealtimeProvider } from '@/context/RealtimeProvider';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ProfileProvider>
      <RealtimeProvider>
        <AuthGate />
        <StatusBar style="auto" />
      </RealtimeProvider>
    </ProfileProvider>
  );
}