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

  const handleLogin = (email: string) => {
    setShowProfileSetup(true);
    setEmail(email)
  };

  const handleProfileSetupComplete = async (profileData: any) => {
    setShowProfileSetup(false);
    try {
      const id = profileData?._id ?? profileData?.id ?? null;
      if (!id) {
        console.warn('handleProfileSetupComplete: no user id found on profileData');
        return;
      }
      await AsyncStorage.setItem('my-key', id);
      setProfile(profileData);
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
        <LoginScreen onLogin={handleLogin} />
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