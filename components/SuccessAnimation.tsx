import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SuccessAnimation({ onComplete, connectionData }) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const penguinBounce = useRef(new Animated.Value(0)).current;
  const penguinDance = useRef(new Animated.Value(0)).current;
  const thumbAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Penguin "pop in", fade in, then start dance & thumbs up
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(penguinBounce, {
              toValue: -18,
              duration: 320,
              useNativeDriver: true,
            }),
            Animated.timing(penguinBounce, {
              toValue: 0,
              duration: 320,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(penguinDance, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(penguinDance, {
              toValue: -1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(penguinDance, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.sequence([
          Animated.delay(350),
          Animated.spring(thumbAnim, {
            toValue: 1,
            friction: 2,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Penguin dance rotation
  const rotate = penguinDance.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  // Thumb up hand pops up
  const thumbUpScale = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1.1],
  });
  const thumbUpTranslate = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Penguin character */}
        <Animated.View
          style={[
            styles.penguinBody,
            {
              transform: [
                { translateY: penguinBounce },
                { rotate: rotate },
              ],
            },
          ]}
        >
          {/* Head */}
          <View style={styles.penguinHead}>
            <View style={styles.penguinEye} />
            <View style={[styles.penguinEye, { marginLeft: 10 }]} />
            <View style={styles.penguinBeak} />
          </View>
          {/* Belly */}
          <View style={styles.penguinBelly} />
          {/* Left wing (thumb up) */}
          <Animated.View
            style={[
              styles.penguinWing,
              {
                left: -18,
                transform: [
                  { rotate: '-30deg' },
                  { scale: thumbUpScale },
                  { translateY: thumbUpTranslate },
                ],
                zIndex: 2,
                backgroundColor: '#FFD700',
                borderColor: '#B8860B',
                borderWidth: 1.2,
              },
            ]}
          >
            {/* Thumb */}
            <View style={styles.thumbUp} />
          </Animated.View>
          {/* Right wing */}
          <View
            style={[
              styles.penguinWing,
              { left: undefined, right: -18, transform: [{ rotate: '24deg' }], zIndex: 1 },
            ]}
          />
          {/* Feet */}
          <View style={[styles.penguinFoot, { left: 12 }]} />
          <View style={[styles.penguinFoot, { right: 12 }]} />
        </Animated.View>

        {/* Speech bubble */}
        <Animated.View style={[styles.speechBubble, { opacity: thumbAnim }]}>
          <Text style={styles.speechText}>Thumbs up!</Text>
        </Animated.View>

        <Text style={styles.title}>Connection Successful!</Text>
        <Text style={styles.subtitle}>
          You’ve successfully connected with a new contact
        </Text>

        <View style={styles.rewardContainer}>
          <View style={styles.rewardBox}>
            {/* Trophy emoji for reward */}
            <Text style={styles.rewardEmoji}>🏆</Text>
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
  // Penguin
  penguinBody: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  penguinHead: {
    width: 44,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  penguinEye: {
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginTop: -5,
  },
  penguinBeak: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF8C00',
    position: 'absolute',
    bottom: -7,
    left: 12,
  },
  penguinBelly: {
    width: 38,
    height: 54,
    backgroundColor: '#000000',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  penguinWing: {
    position: 'absolute',
    top: 28,
    width: 19,
    height: 31,
    backgroundColor: '#000000',
    borderRadius: 10,
    zIndex: 1,
  },
  thumbUp: {
    position: 'absolute',
    width: 12,
    height: 20,
    backgroundColor: '#FFD700',
    borderRadius: 7,
    left: 8,
    top: 6,
    borderWidth: 1,
    borderColor: '#B8860B',
    transform: [
      { rotate: '-15deg' }
    ],
  },
  penguinFoot: {
    position: 'absolute',
    bottom: -10,
    width: 13,
    height: 8,
    backgroundColor: '#FFB347',
    borderRadius: 6,
    zIndex: 0,
  },
  // Speech bubble
  speechBubble: {
    position: 'absolute',
    top: 10,
    left: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderColor: '#ddd',
    borderWidth: 1.5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  speechText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Text and reward
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 34,
    lineHeight: 26,
  },
  rewardContainer: {
    marginBottom: 30,
  },
  rewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 21,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 11,
    elevation: 6,
  },
  rewardEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  footerText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
});