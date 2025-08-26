import { useState } from 'react';
import { router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileType } from '@/types/ProfileTypes';
import LoginScreen from '@/components/login';
import LoadingScreen from '@/components/LoadingScreen';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import { useProfile } from '@/context/ProfileContext';
import { saveProfile } from '@/utils/saveProfile';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function AuthGate() {
  const { profile, setProfile, loading, session } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [email, setEmail] = useState<string>("")
  const [authState, setAuthState] = useState<{ success: boolean; needsProfile: boolean } | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const handleLogin = (email: string) => {
    setShowProfileSetup(true);
    setEmail(email)
  };




  const handleProfileSetupComplete = async (profileData: ProfileType) => {
    setSaving(true);
    try {
      await saveProfile(profileData);
      // update context before allowing access
      setProfile(profileData);
      // navigate only after profile is saved and context updated
      // router.replace("/(tabs)");
      setSaving(false);
      setShowProfileSetup(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.log("This is the error",message)
      Alert.alert("Profile not saved", message);
    } finally {
      setSaving(false);
      setShowProfileSetup(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // If profile is missing, require setup before allowing access.
  if (!profile) {
    // no session yet -> show login flow which can open the setup modal
    if (!session) {
      return (
        <>
          <LoginScreen
            onLogin={(email) => {/* navigate to app */}}
            onSetupProfile={(email) => {
              setShowProfileSetup(true);
              setEmail(email);
            }}
            onAuthResult={(r) => {
              setAuthState({ success: r.success, needsProfile: r.needsProfile });
              if (r.success && !r.needsProfile) {
                router.replace("/(tabs)");
              } else if (r.success && r.needsProfile) {
                setShowProfileSetup(true);
                setEmail(r.email ?? "");
              } else {
                Alert.alert("Authentication failed", r.error ?? "Unknown error");
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
  
    // session exists but profile missing -> force profile setup immediately
    return (
      <ProfileSetupModal
        visible={true}
        onComplete={handleProfileSetupComplete}
        email={session?.user?.email ?? email}
      />
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