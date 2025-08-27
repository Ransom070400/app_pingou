import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { QrCode, Flashlight, FlashlightOff } from 'lucide-react-native';
import SuccessAnimation from '@/components/SuccessAnimation';
import FetchedUser from '@/components/fetchedUser';
import { getProfile } from '@/hooks/getProfile';
import { ProfileType } from '@/types/ProfileTypes';
import { supabase } from '@/lib/supabase';

import { router } from 'expo-router';

export default function ScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashlight, setFlashlight] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fetchedProfile, setFetchedProfile] = useState<ProfileType | null>(null);
  const [scanned, setScanned] = useState(false);


  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <View style={styles.permissionIcon}>
            <QrCode size={80} color="#000000" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Pingu needs camera access to scan QR codes and connect with other users
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) {
      return;
    }
    setScanned(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Prevent connecting with oneself
      if (user.id === data) {
        router.replace("/(tabs)")
        return; 
      }

      // Create connection in the database
      const { error } = await supabase
        .from('connections')
        .insert({ sender_id: user.id, receiver_id: data });

      // Error code '23505' is for unique constraint violation.
      // We can ignore it, as it just means the connection already exists.
      if (error && error.code !== '23505') {
        throw error;
      }

      // Fetch profile to show the success screen
      // data here refers to the scanned id.
      const profile = await getProfile(data);
      setFetchedProfile(profile);
      if (profile){
        setShowSuccess(true);
      }

    } catch (error) {
      console.error('Error handling barcode scan:', error);
      // Optionally, show an error message to the user here
    } finally {
      // Allow scanning again after a delay, even if it failed
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const toggleFlashlight = () => {
    setFlashlight(!flashlight);
  };

  if (showSuccess && fetchedProfile) {
    return (
      <View style={{ flex: 1 }}>
       
        <FetchedUser
         user={fetchedProfile} 
         onClose={() => {
           setShowSuccess(false);
           setFetchedProfile(null);
         }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.title}>Scan QR Code</Text>
            <Text style={styles.subtitle}>Point your camera at a QR code to connect</Text>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <View style={styles.scanLine} />
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, flashlight && styles.controlButtonActive]}
              onPress={toggleFlashlight}
            >
              {flashlight ? (
                <FlashlightOff size={24} color={flashlight ? "#000000" : "#FFFFFF"} />
              ) : (
                <Flashlight size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  controls: {
    alignItems: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  controlButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  permissionContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  permissionButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});