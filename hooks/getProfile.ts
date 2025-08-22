import { ProfileType } from "@/context/ProfileContext";

export async function getProfile(userId: string) : Promise<ProfileType | null> {
  const BASE_URL = 'https://pingou-20c437628612.herokuapp.com';
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.warn('Could not fetch profile', err);
    return null;
  }
}