import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Instagram, Twitter, Linkedin, Mail, Phone, Calendar } from 'lucide-react-native';
import ConnectionDetailModal from '@/components/ConnectionDetailModal';

export default function ConnectionsScreen() {
  const [connections, setConnections] = useState([
    {
      id: '1',
      name: 'Alice Johnson',
      nickname: 'AJ',
      email: 'alice@example.com',
      phone: '+1 (555) 234-5678',
      instagram: '@alicejohnson',
      twitter: '@alice_j',
      linkedin: 'linkedin.com/in/alicejohnson',
      avatar_url: null,
      connected_at: '2024-01-15T10:30:00Z',
      ping_tokens_earned: 1,
    },
    {
      id: '2',
      name: 'Bob Smith',
      nickname: 'Bobby',
      email: 'bob@example.com',
      phone: '+1 (555) 345-6789',
      instagram: '@bobsmith',
      twitter: '@bob_smith',
      linkedin: 'linkedin.com/in/bobsmith',
      avatar_url: null,
      connected_at: '2024-01-14T15:45:00Z',
      ping_tokens_earned: 1,
    },
    {
      id: '3',
      name: 'Carol Davis',
      nickname: 'CD',
      email: 'carol@example.com',
      phone: '+1 (555) 456-7890',
      instagram: '@caroldavis',
      twitter: '@carol_d',
      linkedin: 'linkedin.com/in/caroldavis',
      avatar_url: null,
      connected_at: '2024-01-13T09:15:00Z',
      ping_tokens_earned: 1,
    },
  ]);

  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const ConnectionCard = ({ connection }) => (
    <TouchableOpacity
      style={styles.connectionCard}
      onPress={() => {
        setSelectedConnection(connection);
        setShowDetailModal(true);
      }}
    >
      <View style={styles.connectionCardContent}>
        <View style={styles.avatarContainer}>
          {connection.avatar_url ? (
            <Image source={{ uri: connection.avatar_url }} style={styles.avatar} />
          ) : (
            <LinearGradient
              colors={['#f8f9fa', '#e9ecef']}
              style={styles.avatar}
            >
              <Text style={styles.avatarInitials}>
                {connection.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </LinearGradient>
          )}
        </View>

        <View style={styles.connectionInfo}>
          <Text style={styles.connectionName}>{connection.name}</Text>
          <Text style={styles.connectionNickname}>"{connection.nickname}"</Text>
          <View style={styles.connectionMeta}>
            <Calendar size={14} color="#666666" />
            <Text style={styles.connectionDate}>Connected {formatDate(connection.connected_at)}</Text>
          </View>
        </View>

        <View style={styles.connectionActions}>
          <View style={styles.pingBadge}>
            <Text style={styles.pingText}>+{connection.ping_tokens_earned}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connections</Text>
        <Text style={styles.subtitle}>Your networking history</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Users size={24} color="#000000" />
            <Text style={styles.statValue}>{connections.length}</Text>
            <Text style={styles.statLabel}>Total Connections</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.connectionsContainer}>
          {connections.length > 0 ? (
            connections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Users size={60} color="#cccccc" />
              <Text style={styles.emptyTitle}>No Connections Yet</Text>
              <Text style={styles.emptyText}>
                Start scanning QR codes to build your network
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <ConnectionDetailModal
        visible={showDetailModal}
        connection={selectedConnection}
        onClose={() => setShowDetailModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 25,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  connectionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  connectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  connectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  connectionNickname: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  connectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDate: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
  connectionActions: {
    alignItems: 'center',
  },
  pingBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 40,
  },
});