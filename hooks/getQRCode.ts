import AsyncStorage from '@react-native-async-storage/async-storage';
import { jsonToString } from './convertJsonUtils';

const BASE_URL = 'https://pingou-20c437628612.herokuapp.com';

export async function getQRCode() {
  try {
    const storedId = await AsyncStorage.getItem('my-key');
    if (!storedId) throw new Error('No user ID found');

    const res = await fetch(`${BASE_URL}/users/${storedId}/qrcode`);
    if (!res.ok) throw new Error('Network response was not ok');

    // Assuming the QR code is returned as a JSON object with a 'qrcode' field
    const data = await res.json();
    const qrString = jsonToString(data.qrcode.data);
    if (!qrString) throw new Error('Failed to convert QR code data to string');
    return data.qrcode.data; // Return the QR code data directly
  } catch (err) {
    console.warn('Could not fetch QR code', err);
    return null;
  }
}