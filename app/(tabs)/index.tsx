import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard as Edit3, Camera, Trophy, Users as UsersIcon } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import * as ImagePicker from 'expo-image-picker';
import { api } from '@/lib/supabase';
import EditProfileModal from '@/components/EditProfileModal';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    id: 'user123',
    name: 'John Doe',
    nickname: 'JD',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    instagram: '@johndoe',
    twitter: '@johndoe',
    linkedin: 'linkedin.com/in/johndoe',
    avatar_url: null,
    ping_tokens: 42,
    qr_code_data: 'user123',
  });
  
  const [connectionsCount, setConnectionsCount] = useState(18);
  const [showEditModal, setShowEditModal] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfile(prev => ({ ...prev, avatar_url: result.assets[0].uri }));
    }
  };

  const ProfileImage = () => (
    <View style={styles.profileImageContainer}>
      <View style={styles.profileImageShadow}>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.profileImage} />
        ) : (
          <LinearGradient
            colors={['#f8f9fa', '#e9ecef']}
            style={styles.profileImage}
          >
            <Text style={styles.profileInitials}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </LinearGradient>
        )}
      </View>
      <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
        <Camera size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ProfileImage />
          
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.nickname}>"{profile.nickname}"</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <View style={styles.editButtonShadow}>
              <Edit3 size={16} color="#000000" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Trophy size={24} color="#FFD700" />
              </View>
              <Text style={styles.statValue}>{profile.ping_tokens}</Text>
              <Text style={styles.statLabel}>Ping Tokens</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <UsersIcon size={24} color="#000000" />
              </View>
              <Text style={styles.statValue}>{connectionsCount}</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
          </View>
        </View>

        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>Your QR Code</Text>
          <View style={styles.qrContainer}>
            <View style={styles.qrCard}>
              <QRCode
                value={profile.qr_code_data}
                size={180}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
              <Text style={styles.qrSubtext}>Others can scan this to connect with you</Text>
            </View>
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{profile.email}</Text>
            </View>
            <View style={styles.contactDivider} />
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{profile.phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          <View style={styles.socialCard}>
            <View style={styles.socialItem}>
              <Text style={styles.socialLabel}>Instagram</Text>
              <Text style={styles.socialValue}>{profile.instagram}</Text>
            </View>
            <View style={styles.contactDivider} />
            <View style={styles.socialItem}>
              <Text style={styles.socialLabel}>Twitter</Text>
              <Text style={styles.socialValue}>{profile.twitter}</Text>
            </View>
            <View style={styles.contactDivider} />
            <View style={styles.socialItem}>
              <Text style={styles.socialLabel}>LinkedIn</Text>
              <Text style={styles.socialValue}>{profile.linkedin}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <EditProfileModal
        visible={showEditModal}
        profile={profile}
        onClose={() => setShowEditModal(false)}
        onSave={(updatedProfile) => {
          setProfile(updatedProfile);
          setShowEditModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImageShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  profileInitials: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000000',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 5,
  },
  nickname: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  editButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  editButtonShadow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#000000',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 15,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  qrSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  qrSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  contactItem: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  contactDivider: {
    height: 1,
    backgroundColor: '#f1f3f4',
    marginHorizontal: 25,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  socialSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  socialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  socialItem: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  socialLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    fontWeight: '500',
  },
  socialValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});