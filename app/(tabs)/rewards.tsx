import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Gift, Star, Target, TrendingUp } from 'lucide-react-native';

export default function RewardsScreen() {
  const [userStats] = useState({
    totalPings: 42,
    weeklyPings: 8,
    monthlyPings: 23,
    level: 3,
    nextLevelPings: 18,
    streak: 5,
  });

  const [rewards] = useState([
    {
      id: 1,
      title: 'Coffee Voucher',
      description: 'Get a free coffee at participating cafes',
      cost: 25,
      type: 'voucher',
      available: true,
    },
    {
      id: 2,
      title: 'Premium Features',
      description: 'Unlock advanced profile customization',
      cost: 50,
      type: 'feature',
      available: true,
    },
    {
      id: 3,
      title: 'Event VIP Access',
      description: 'Skip the line at select events',
      cost: 100,
      type: 'access',
      available: false,
    },
  ]);

  const [achievements] = useState([
    {
      id: 1,
      title: 'First Connection',
      description: 'Made your first connection',
      earned: true,
      icon: '🤝',
    },
    {
      id: 2,
      title: 'Networking Pro',
      description: 'Connected with 10+ people',
      earned: true,
      icon: '🌟',
    },
    {
      id: 3,
      title: 'Event Master',
      description: 'Attended 5+ events',
      earned: false,
      icon: '🎯',
    },
  ]);

  const RewardCard = ({ reward }) => (
    <TouchableOpacity
      style={[styles.rewardCard, !reward.available && styles.rewardCardDisabled]}
      disabled={!reward.available}
    >
      <LinearGradient
        colors={reward.available ? ['#FFFFFF', '#F8F8F8'] : ['#F5F5F5', '#EEEEEE']}
        style={styles.rewardCardGradient}
      >
        <View style={styles.rewardHeader}>
          <View style={styles.rewardIcon}>
            <Gift size={24} color={reward.available ? '#8B4513' : '#A0A0A0'} />
          </View>
          <View style={styles.rewardCost}>
            <Text style={[styles.costText, !reward.available && styles.costTextDisabled]}>
              {reward.cost}
            </Text>
            <Text style={[styles.costLabel, !reward.available && styles.costLabelDisabled]}>
              Pings
            </Text>
          </View>
        </View>
        
        <Text style={[styles.rewardTitle, !reward.available && styles.rewardTitleDisabled]}>
          {reward.title}
        </Text>
        <Text style={[styles.rewardDescription, !reward.available && styles.rewardDescriptionDisabled]}>
          {reward.description}
        </Text>
        
        <View style={styles.rewardFooter}>
          <Text style={[styles.rewardStatus, !reward.available && styles.rewardStatusDisabled]}>
            {reward.available ? 'Available' : 'Not enough Pings'}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const AchievementCard = ({ achievement }) => (
    <View style={[styles.achievementCard, achievement.earned && styles.achievementCardEarned]}>
      <View style={styles.achievementIcon}>
        <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
      </View>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, achievement.earned && styles.achievementTitleEarned]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, achievement.earned && styles.achievementDescriptionEarned]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.earned && (
        <View style={styles.achievementBadge}>
          <Star size={16} color="#FFD700" />
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#FFF8DC', '#F5F5DC', '#FAEBD7']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>Earn Pings and unlock rewards</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#8B4513', '#A0522D']}
            style={styles.statsGradient}
          >
            <View style={styles.mainStat}>
              <Trophy size={32} color="#FFD700" />
              <Text style={styles.pingCount}>{userStats.totalPings}</Text>
              <Text style={styles.pingLabel}>Total Pings</Text>
            </View>
            
            <View style={styles.subStats}>
              <View style={styles.subStat}>
                <TrendingUp size={20} color="#FFFFFF" />
                <Text style={styles.subStatValue}>{userStats.weeklyPings}</Text>
                <Text style={styles.subStatLabel}>This Week</Text>
              </View>
              <View style={styles.subStat}>
                <Target size={20} color="#FFFFFF" />
                <Text style={styles.subStatValue}>{userStats.streak}</Text>
                <Text style={styles.subStatLabel}>Day Streak</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          {rewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </View>
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
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statsGradient: {
    padding: 25,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pingCount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 10,
  },
  pingLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 5,
  },
  subStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subStat: {
    alignItems: 'center',
  },
  subStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 5,
  },
  subStatLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 15,
  },
  rewardCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  rewardCardDisabled: {
    opacity: 0.6,
  },
  rewardCardGradient: {
    padding: 20,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardCost: {
    alignItems: 'center',
  },
  costText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
  },
  costTextDisabled: {
    color: '#A0A0A0',
  },
  costLabel: {
    fontSize: 12,
    color: '#A0522D',
  },
  costLabelDisabled: {
    color: '#A0A0A0',
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 5,
  },
  rewardTitleDisabled: {
    color: '#A0A0A0',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#A0522D',
    marginBottom: 15,
  },
  rewardDescriptionDisabled: {
    color: '#A0A0A0',
  },
  rewardFooter: {
    alignItems: 'flex-end',
  },
  rewardStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  rewardStatusDisabled: {
    color: '#FF5722',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementCardEarned: {
    backgroundColor: '#F0F8FF',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0A0A0',
    marginBottom: 2,
  },
  achievementTitleEarned: {
    color: '#8B4513',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  achievementDescriptionEarned: {
    color: '#A0522D',
  },
  achievementBadge: {
    padding: 5,
  },
  bottomSpacing: {
    height: 20,
  },
});