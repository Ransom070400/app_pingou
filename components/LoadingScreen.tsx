import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const penguin1Scale = useRef(new Animated.Value(0.8)).current;
  const penguin2Scale = useRef(new Animated.Value(0.8)).current;
  const penguin1Position = useRef(new Animated.Value(60)).current;
  const penguin2Position = useRef(new Animated.Value(-60)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateHug = () => {
      Animated.parallel([
        Animated.spring(penguin1Position, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(penguin2Position, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(penguin1Scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(penguin2Scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.spring(heartScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      });
    };

    animateHug();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.penguinContainer}>
        <Animated.View
          style={[
            styles.penguin,
            {
              transform: [
                { translateX: penguin1Position },
                { scale: penguin1Scale },
              ],
            },
          ]}
        >
          <View style={styles.penguinBody}>
            <View style={styles.penguinHead}>
              <View style={styles.penguinEye} />
              <View style={[styles.penguinEye, { marginLeft: 10 }]} />
              <View style={styles.penguinBeak} />
            </View>
            <View style={styles.penguinBelly} />
            <View style={styles.penguinWing} />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.penguin,
            {
              transform: [
                { translateX: penguin2Position },
                { scale: penguin2Scale },
                { scaleX: -1 },
              ],
            },
          ]}
        >
          <View style={styles.penguinBody}>
            <View style={styles.penguinHead}>
              <View style={styles.penguinEye} />
              <View style={[styles.penguinEye, { marginLeft: 10 }]} />
              <View style={styles.penguinBeak} />
            </View>
            <View style={styles.penguinBelly} />
            <View style={styles.penguinWing} />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.heart,
            {
              transform: [{ scale: heartScale }],
            },
          ]}
        >
          <View style={styles.heartShape} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  penguinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  penguin: {
    marginHorizontal: 25,
  },
  penguinBody: {
    alignItems: 'center',
    position: 'relative',
  },
  penguinHead: {
    width: 50,
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  penguinEye: {
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginTop: -6,
  },
  penguinBeak: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF8C00',
    position: 'absolute',
    bottom: -10,
  },
  penguinBelly: {
    width: 45,
    height: 60,
    backgroundColor: '#000000',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  penguinWing: {
    position: 'absolute',
    top: 35,
    left: -8,
    width: 20,
    height: 35,
    backgroundColor: '#000000',
    borderRadius: 10,
    transform: [{ rotate: '15deg' }],
  },
  heart: {
    position: 'absolute',
    top: -40,
  },
  heartShape: {
    width: 24,
    height: 22,
    backgroundColor: '#FF69B4',
    borderRadius: 12,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});