import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from '@/components/login';
import LoadingScreen from '@/components/LoadingScreen';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Check if user needs to complete profile setup
    // You might want to check this from your backend/storage
    const hasCompletedProfile = false; // Replace with actual check
    setShowProfileSetup(!hasCompletedProfile);
  };

  const handleProfileSetupComplete = (profileData: any) => {
    setUserProfile(profileData);
    setShowProfileSetup(false);
    // Save profile data to your backend/storage here
    console.log('Profile setup completed:', profileData);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      
      <ProfileSetupModal
        visible={showProfileSetup}
        onComplete={handleProfileSetupComplete}
      />
    </>
  );
}