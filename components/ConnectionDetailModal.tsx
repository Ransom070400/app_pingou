import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Instagram, Twitter, Linkedin, Mail, Phone, ExternalLink } from 'lucide-react-native';
import { ProfileType } from '@/types/ProfileTypes';

interface ConnectionDetailModalProps {
  visible: boolean;
  connection: ProfileType;
  onClose: () => void;
}

export default function ConnectionDetailModal({ visible, connection, onClose }: ConnectionDetailModalProps) {
  if (!connection) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSocialLink = (platform, username) => {
    let url = '';
    switch (platform) {
      case 'instagram':
        url = `https://instagram.com/${username.replace('@', '')}`;
        break;
      case 'twitter':
        url = `https://twitter.com/${username.replace('@', '')}`;
        break;
      case 'linkedin':
        url = username.startsWith('http') ? username : `https://${username}`;
        break;
      case 'email':
        url = `mailto:${username}`;
        break;
      case 'phone':
        url = `tel:${username}`;
        break;
    }
    if (url) {
      Linking.openURL(url);
    }
  };

  const SocialLink = ({ icon: Icon, label, value, platform, color }) => (
    <TouchableOpacity
      style={styles.socialLink}
      onPress={() => handleSocialLink(platform, value)}
    >
      <View style={styles.socialIconContainer}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.socialContent}>
        <Text style={styles.socialLabel}>{label}</Text>
        <Text style={styles.socialValue}>{value}</Text>
      </View>
      <ExternalLink size={16} color="#666666" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Connection Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {connection.profile_url ? (
                <Image source={{ uri: connection.profile_url }} style={styles.avatar} />
              ) : (
                <LinearGradient
                  colors={['#f8f9fa', '#e9ecef']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarInitials}>
                    // Similar fix needed here
                    {(connection.fullname || '').split(' ').map(n => n[0] || '').join('')}
                  </Text>
                </LinearGradient>
              )}
            </View>

            <Text style={styles.name}>{connection.fullname}</Text>
            <Text style={styles.nickname}>"{connection.nickname}"</Text>
            
            <View style={styles.connectionInfo}>
              {/* <Text style={styles.connectionDate}>
                Connected on {formatDate(connection.updated_at)}
              </Text> */}
              {/* <View style={styles.pingBadge}>
                <Text style={styles.pingText}>Earned +{connection.ping_tokens_earned} Ping Token</Text>
              </View> */}
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactCard}>
              <SocialLink
                icon={Mail}
                label="Email"
                value={connection.email}
                platform="email"
                color="#000000"
              />
              <View style={styles.divider} />
              <SocialLink
                icon={Phone}
                label="Phone"
                value={connection.phone}
                platform="phone"
                color="#000000"
              />
            </View>
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Social Media</Text>
            <View style={styles.socialCard}>
              <SocialLink
                icon={Instagram}
                label="Instagram"
                value={connection.instagram}
                platform="instagram"
                color="#E4405F"
              />
              <View style={styles.divider} />
              <SocialLink
                icon={Twitter}
                label="Twitter"
                value={connection.twitter}
                platform="twitter"
                color="#1DA1F2"
              />
              <View style={styles.divider} />
              <SocialLink
                icon={Linkedin}
                label="LinkedIn"
                value={connection.linkedin}
                platform="linkedin"
                color="#0077B5"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 16,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  connectionInfo: {
    alignItems: 'center',
  },
  connectionDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  pingBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  pingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contactSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  socialSection: {
    marginBottom: 30,
  },
  socialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  socialContent: {
    flex: 1,
  },
  socialLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  socialValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f3f4',
    marginHorizontal: 20,
  },
});