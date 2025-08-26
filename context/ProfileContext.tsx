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
  loading: boolean;
}>({
  profile: null,
  setProfile: () => {},
  loading: false,
} as any);

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(false);



  // /* Fetch the stored user ID then download the profile from your API */
  // useEffect(() => {
  //   let mounted = true;
  //   const loadProfile = async () => {
  //     console.log('loadProfile called');
  //     setLoading(true);
  //     try {
  //       const storedId = await AsyncStorage.getItem('my-key');
  //       console.log('storedId:', storedId);
  //       if (!storedId) {
  //         console.log('no storedId found');
  //         if (mounted) setLoading(false);
  //         return;
  //       }

  //       const res = await fetch(`https://pingou-20c437628612.herokuapp.com/users/${storedId}`);
  //       console.log('fetch status', res.status);
  //       if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
  //       const data: ProfileType = await res.json();
  //       if (mounted) setProfile(data);
  //     } catch (err) {
  //       console.warn('Could not load profile', err);
  //     } finally {
  //       if (mounted) setLoading(false);
  //     }
  //   };

  //   loadProfile();
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};