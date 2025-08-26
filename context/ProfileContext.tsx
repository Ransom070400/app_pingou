import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ProfileType } from '@/types/ProfileTypes';

const ProfileContext = createContext<{
  profile: ProfileType | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
  loading: boolean;
  session: Session | null;
}>({
  profile: null,
  setProfile: () => {},
  loading: false,
  session: null,
} as any);

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          if (!mounted) return;
          if (error) {
            // profile might not exist yet
            setProfile(null);
            setLoading(false)
          } else {
            setProfile(data ?? null);
            setLoading(false)
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.warn('Failed to load profile from Supabase', err);
        setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [session]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading, session }}>
      {children}
    </ProfileContext.Provider>
  );
};