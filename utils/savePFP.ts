import { supabase } from '@/lib/supabase';
import { updateProfile } from './updateProfile';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

/**
 * Uploads a profile picture from a local URI using base64 encoding,
 * then saves the signed URL to the user's profile.
 * @param fileUri The local URI of the image file.
 * @returns The signed URL of the uploaded image.
 */
export async function savePFP(fileUri: string): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to update your profile picture.');
  }

  // Read the file from the URI and encode it as base64
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: 'base64',
  });

  const fileExt = fileUri.split('.').pop();
  const filePath = `${user.id}.${fileExt}`;
  const contentType = `image/${fileExt}`;

  // Upload the decoded base64 string
  const { error: uploadError } = await supabase.storage
    .from('pfp')
    .upload(filePath, decode(base64), {
      contentType,
      upsert: true, // Overwrite existing file for the user
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Create a signed URL for the private file.
  const { data, error: signedUrlError } = await supabase.storage
    .from('pfp')
    .createSignedUrl(filePath, 31536000); // 1 year

  if (signedUrlError) {
    throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
  }

  const imageUrl = data.signedUrl;

  // Save the signed URL to the user's profile table
  await updateProfile(user.id, { profile_url: imageUrl });

  return imageUrl;
}