import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ProfileType } from '@/types/ProfileTypes';

// 1. Create the Context
const RealtimeContext = createContext<{ connections: ProfileType[] }>({ connections: [] });

// 2. Create the Provider Component
export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [connections, setConnections] = useState<ProfileType[]>([]);

  const fetchConnections = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all connection rows where the user is either the sender or receiver
      const { data: connectionRows, error: connectionsError } = await supabase
        .from('connections')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (connectionsError) throw connectionsError;

      // Get the ID of the other user in each connection
      const friendIds = connectionRows.map(conn => 
        conn.sender_id === user.id ? conn.receiver_id : conn.sender_id
      );

      if (friendIds.length === 0) {
        setConnections([]);
        return;
      }

      // Fetch the profiles for all connected user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', friendIds);

      if (profilesError) throw profilesError;

      setConnections(profiles || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  }, []);

  useEffect(() => {
    // Fetch initial connections on mount
    fetchConnections();

    // Set up the real-time subscription
    const channel = supabase
      .channel('public:connections')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'connections' },
        async (payload) => {
          console.log('New connection received!', payload);
          
          // --- OPTIMIZED REAL-TIME UPDATE ---
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const newConnection = payload.new as { sender_id: string; receiver_id: string };
            
            // Determine the ID of the new friend
            const friendId = newConnection.sender_id === user.id 
              ? newConnection.receiver_id 
              : newConnection.sender_id;

            // Fetch the profile of the new friend
            const { data: newProfile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', friendId)
              .single();

            if (error) throw error;

            // Add the new profile to the existing connections state
            if (newProfile) {
              setConnections(prevConnections => [...prevConnections, newProfile]);
            }

          } catch (error) {
            console.error('Error processing real-time update, falling back to full fetch:', error);
            // If anything goes wrong, fall back to the reliable full fetch
            fetchConnections();
          }
        }
      )
      .subscribe();

    return () => {
      // Clean up the subscription when the component unmounts
      supabase.removeChannel(channel);
    };
  }, [fetchConnections]);

  return (
    <RealtimeContext.Provider value={{ connections }}>
      {children}
    </RealtimeContext.Provider>
  );
};

// 3. Create the custom hook
export const useRealtimeConnections = () => {
  return useContext(RealtimeContext);
};