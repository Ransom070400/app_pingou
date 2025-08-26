import { useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '@/components/login';
import LoadingScreen from '@/components/LoadingScreen';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import { useProfile } from '@/context/ProfileContext';

export default function AuthGate() {
  const { profile, setProfile, loading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [email, setEmail] = useState<string>("")
  const [authState, setAuthState] = useState<{ success: boolean; needsProfile: boolean } | null>(null);

  const handleLogin = (email: string) => {
    console.log("I got here")
    setShowProfileSetup(true);
    setEmail(email)
  };

  const handleProfileSetupComplete = async (profileData: any) => {
    setShowProfileSetup(false);
    try {
    
    } catch (err) {
      console.warn('Failed to save user id to AsyncStorage', err);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <>
        <LoginScreen
          onLogin={(email) => {/* navigate to app */}}
          onSetupProfile={(email) => {/* navigate to profile setup */}}
          onAuthResult={(r) => {
            setAuthState({ success: r.success, needsProfile: r.needsProfile });
            if (r.success && !r.needsProfile) {
              // proceed to app
            } else if (r.success && r.needsProfile) {
              // route to profile setup
              setShowProfileSetup(true);
              setEmail(r.email); // FIX: use r.email
            } else {
              // show error r.error
            }
          }}
        />
        <ProfileSetupModal
          visible={showProfileSetup}
          onComplete={handleProfileSetupComplete}
          email={email}
        />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}