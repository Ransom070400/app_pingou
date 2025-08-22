import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProfileType = {
  // Matched from JSON: MongoDB version field
  __v: number;
  // Matched from JSON: Document ID
  _id: string; // Renamed from _id for consistency
  // Matched from JSON: Creation timestamp
  created_at: string;
  // Matched from JSON
  email: string;
  // Matched from JSON: Split name into first/last
  firstname: string;
  lastname: string;
  // Matched from JSON: Update timestamp
  updated_at: string;
  // Matched from JSON
  username: string;
  // Kept optional fields from original for backwards compatibility
  phone?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  avatar_url?: string | null;
  ping_tokens?: number;
};

const ProfileContext = createContext<{
  profile: ProfileType | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
}>({
  profile: null,
  setProfile: () => {},
} as any);

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);

  /* Fetch the stored user ID then download the profile from your API */
  const loadProfile = useCallback(async () => {
    console.log('loadProfile called');
    try {
      const storedId = await AsyncStorage.getItem('my-key');
      console.log(storedId)
      if (!storedId) {
        console.log('no storedId found');
        return; // no user yet
      }

      const res = await fetch(`https://pingou-20c437628612.herokuapp.com/users/${storedId}`);
      if (!res.ok) throw new Error('Network response was not ok');

      const data: ProfileType = await res.json();
      setProfile(data);
    } catch (err) {
      console.warn('Could not load profile', err);
    }
  }, []);

  /* Run once when the provider mounts */
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};