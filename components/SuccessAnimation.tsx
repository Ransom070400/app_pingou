import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { CircleCheck as CheckCircle, Trophy, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SuccessAnimation({ onComplete, connectionData }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ),
      ]),
    ]);

    sequence.start();

    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const renderConfetti = () => {
    const confetti = [];
    for (let i = 0; i < 30; i++) {
      const randomX = Math.random() * width;
      const randomDelay = Math.random() * 1000;
      const randomSize = Math.random() * 6 + 3;
      const colors = ['#000000', '#666666', '#999999', '#cccccc'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.push(
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              left: randomX,
              width: randomSize,
              height: randomSize,
              backgroundColor: randomColor,
              transform: [
                {
                  translateY: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, height + 100],
                  }),
                },
                {
                  rotate: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: confettiAnim,
            },
          ]}
        />
      );
    }
    return confetti;
  };

  const renderSparkles = () => {
    const sparkles = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * (Math.PI / 180);
      const radius = 120;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      sparkles.push(
        <Animated.View
          key={i}
          style={[
            styles.sparkle,
            {
              transform: [
                { translateX: x },
                { translateY: y },
                { scale: sparkleAnim },
              ],
            },
          ]}
        >
          <Sparkles size={16} color="#000000" />
        </Animated.View>
      );
    }
    return sparkles;
  };

  return (
    <View style={styles.container}>
      {renderConfetti()}
      
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <View style={styles.checkCircle}>
            <CheckCircle size={80} color="#000000" />
          </View>
          {renderSparkles()}
        </View>

        <Text style={styles.title}>Connection Successful!</Text>
        <Text style={styles.subtitle}>
          You've successfully connected with a new contact
        </Text>

        <View style={styles.rewardContainer}>
          <View style={styles.rewardBox}>
            <Trophy size={24} color="#000000" />
            <Text style={styles.rewardText}>+1 Ping Token Earned</Text>
          </View>
        </View>

        <Text style={styles.footerText}>
          Your new connection has been added to your network
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 15,
  },
  sparkle: {
    position: 'absolute',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  rewardContainer: {
    marginBottom: 40,
  },
  rewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  footerText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 22,
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
});