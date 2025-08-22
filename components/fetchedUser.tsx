import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { ProfileType } from '../types/ProfileTypes';

type FetchedUserModalProps = {
  visible?: boolean;
  user: ProfileType;
  onClose?: () => void;
};

const FetchedUserModal: React.FC<FetchedUserModalProps> = ({ visible, user, onClose }) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}
    transparent={false}
  >
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Profile</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.name}>{user.firstname} {user.lastname}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.created}>Joined: {new Date(user.created_at).toLocaleDateString()}</Text>
          {user.avatar_url && <Text style={styles.field}>Avatar: {user.avatar_url}</Text>}
          {user.instagram && <Text style={styles.field}>Instagram: {user.instagram}</Text>}
          {user.twitter && <Text style={styles.field}>Twitter: {user.twitter}</Text>}
          {user.linkedin && <Text style={styles.field}>LinkedIn: {user.linkedin}</Text>}
          {user.phone && <Text style={styles.field}>Phone: {user.phone}</Text>}
          {user.ping_tokens !== undefined && <Text style={styles.field}>Ping Tokens: {user.ping_tokens}</Text>}
        </View>
      </ScrollView>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#000',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  id: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  created: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  field: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
    marginBottom: 2,
  },
});

export default FetchedUserModal;