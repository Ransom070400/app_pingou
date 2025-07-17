import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Users, Plus, Clock } from 'lucide-react-native';

export default function EventsScreen() {
  const [events] = useState([
    {
      id: 1,
      name: 'Tech Conference 2024',
      date: 'March 15, 2024',
      time: '9:00 AM - 6:00 PM',
      location: 'San Francisco, CA',
      participants: 245,
      type: 'Conference',
      status: 'ongoing',
    },
    {
      id: 2,
      name: 'Startup Meetup',
      date: 'March 20, 2024',
      time: '6:00 PM - 9:00 PM',
      location: 'Austin, TX',
      participants: 89,
      type: 'Meetup',
      status: 'upcoming',
    },
    {
      id: 3,
      name: 'Design Workshop',
      date: 'March 25, 2024',
      time: '2:00 PM - 5:00 PM',
      location: 'New York, NY',
      participants: 34,
      type: 'Workshop',
      status: 'upcoming',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return '#4CAF50';
      case 'upcoming':
        return '#FF9800';
      default:
        return '#A0A0A0';
    }
  };

  const EventCard = ({ event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F8F8']}
        style={styles.eventCardGradient}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleContainer}>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
              <Text style={styles.statusText}>{event.status}</Text>
            </View>
          </View>
          <Text style={styles.eventType}>{event.type}</Text>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color="#8B4513" />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={16} color="#8B4513" />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={16} color="#8B4513" />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Users size={16} color="#8B4513" />
            <Text style={styles.detailText}>{event.participants} participants</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#FFF8DC', '#F5F5DC', '#FAEBD7']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>Join events and expand your network</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.createEventContainer}>
          <TouchableOpacity style={styles.createEventButton}>
            <LinearGradient
              colors={['#8B4513', '#A0522D']}
              style={styles.createEventGradient}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createEventText}>Create Event</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Available Events</Text>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0522D',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  createEventContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  createEventButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  createEventGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  createEventText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  eventsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 15,
  },
  eventCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  eventCardGradient: {
    padding: 20,
  },
  eventHeader: {
    marginBottom: 15,
  },
  eventTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventType: {
    fontSize: 14,
    color: '#A0522D',
    fontWeight: '500',
  },
  eventDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#2C2C2C',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 20,
  },
});