import React, { createContext, useState, useContext } from 'react';

export type ProfileType = {
  id?: string;
  name: string;
  nickname?: string;
  email: string;
  phone?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  avatar_url?: string | null;
  ping_tokens?: number;
  qr_code_data?: string;
};

const defaultProfile: ProfileType = {
  name: '',
  nickname: '',
  email: '',
  phone: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  avatar_url: null,
  ping_tokens: 0,
  qr_code_data: '',
};

const ProfileContext = createContext<{
  profile: ProfileType;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType>>;
}>({
  profile: defaultProfile,
  setProfile: () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType>(defaultProfile);
  console.log(profile)

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};