import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Utility to position penguins in a circle
function getCirclePoint(radius: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: radius * Math.cos(angleRad),
    y: radius * Math.sin(angleRad),
  };
}

export default function LoadingScreen() {
  // Animation values for the whole group rotating
  const groupRotate = useRef(new Animated.Value(0)).current;
  // Animation values for penguin bounce
  const penguin1Bounce = useRef(new Animated.Value(0)).current;
  const penguin2Bounce = useRef(new Animated.Value(0)).current;
  const penguin3Bounce = useRef(new Animated.Value(0)).current;
  // Animation values for penguin scale
  const penguin1Scale = useRef(new Animated.Value(1)).current;
  const penguin2Scale = useRef(new Animated.Value(1)).current;
  const penguin3Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Infinite circular group rotation
    Animated.loop(
      Animated.timing(groupRotate, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Penguin bounces (phase shifted for each)
    const bounce = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.spring(anim, {
            toValue: -30,
            friction: 2,
            useNativeDriver: true,
          }),
          Animated.spring(anim, {
            toValue: 0,
            friction: 2,
            useNativeDriver: true,
          }),
        ])
      ).start();

    bounce(penguin1Bounce, 0);
    bounce(penguin2Bounce, 300);
    bounce(penguin3Bounce, 600);

    // Penguin scale dance
    const scaleDance = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1.15,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

    scaleDance(penguin1Scale, 0);
    scaleDance(penguin2Scale, 300);
    scaleDance(penguin3Scale, 600);
  }, []);

  // Prepare positions for penguins in a circle
  const radius = 70;
  const penguinAngles = [0, 120, 240];

  // Group rotation interpolation
  const groupInterpolate = groupRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Penguin component
  const Penguin = ({ bounce, scale, rotate = 0 }) => (
    <Animated.View
      style={{
        transform: [
          { translateY: bounce },
          { scale },
          { rotate: `${rotate}deg` },
        ],
      }}
    >
      <View style={styles.penguinBody}>
        {/* Head */}
        <View style={styles.penguinHead}>
          <View style={styles.penguinEye} />
          <View style={[styles.penguinEye, { marginLeft: 10 }]} />
          <View style={styles.penguinBeak} />
        </View>
        {/* Belly */}
        <View style={styles.penguinBelly} />
        {/* Left Wing */}
        <View style={[styles.penguinWing, { left: -18, transform: [{ rotate: '22deg' }] }]} />
        {/* Right Wing */}
        <View style={[styles.penguinWing, { left: undefined, right: -18, transform: [{ rotate: '-22deg' }] }]} />
        {/* Feet */}
        <View style={[styles.penguinFoot, { left: 12 }]} />
        <View style={[styles.penguinFoot, { right: 12 }]} />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circleContainer,
          {
            transform: [{ rotate: groupInterpolate }],
          },
        ]}
      >
        {/* Penguin 1 */}
        <View
          style={[
            styles.penguinWrapper,
            getCirclePointStyle(radius, penguinAngles[0]),
          ]}
        >
          <Penguin bounce={penguin1Bounce} scale={penguin1Scale} rotate={0} />
        </View>
        {/* Penguin 2 */}
        <View
          style={[
            styles.penguinWrapper,
            getCirclePointStyle(radius, penguinAngles[1]),
          ]}
        >
          <Penguin bounce={penguin2Bounce} scale={penguin2Scale} rotate={120} />
        </View>
        {/* Penguin 3 */}
        <View
          style={[
            styles.penguinWrapper,
            getCirclePointStyle(radius, penguinAngles[2]),
          ]}
        >
          <Penguin bounce={penguin3Bounce} scale={penguin3Scale} rotate={240} />
        </View>
      </Animated.View>
    </View>
  );
}

// Helper to generate absolute position for each penguin in the circle
function getCirclePointStyle(radius: number, angleDeg: number) {
  const { x, y } = getCirclePoint(radius, angleDeg);
  return {
    position: 'absolute' as const,
    left: 100 + x,
    top: 100 + y,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 240,
    height: 240,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  penguinWrapper: {
    width: 80,
    height: 110,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  penguinBody: {
    alignItems: 'center',
    position: 'relative',
  },
  penguinHead: {
    width: 40,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
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
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF8C00',
    position: 'absolute',
    bottom: -8,
    left: 12,
  },
  penguinBelly: {
    width: 36,
    height: 54,
    backgroundColor: '#000000',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 3,
  },
  penguinWing: {
    position: 'absolute',
    top: 26,
    width: 16,
    height: 28,
    backgroundColor: '#000000',
    borderRadius: 10,
    zIndex: 1,
  },
  penguinFoot: {
    position: 'absolute',
    bottom: -8,
    width: 12,
    height: 7,
    backgroundColor: '#FFB347',
    borderRadius: 6,
    zIndex: 0,
  },
});
