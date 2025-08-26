import { supabase } from '@/lib/supabase';
import type { ProfileType } from '@/types/ProfileTypes';

export type ProfileChanges = Partial<Omit<ProfileType, 'user_id' | 'created_at' | 'updated_at'>>;

export async function updateProfile(
  user_id: string,
  changes: ProfileChanges
): Promise<ProfileType> {
  if (Object.keys(changes).length === 0) {
    throw new Error('Nothing to update');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(changes)
    .eq('user_id', user_id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}