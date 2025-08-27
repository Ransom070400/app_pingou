import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/types/ProfileTypes";

export async function getProfile(userId: string) : Promise<ProfileType | null> {
  try {
   const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.warn('Could not fetch profile from Supabase', err);
    return null;
  }
}