import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/types/ProfileTypes";

export async function saveProfile(profileData: ProfileType) {
    const { data, error } = await supabase
        .from('profiles')
       .insert(profileData)
    if (error) {
       console.log("Error form save profile", error)
    }
    return data;
}