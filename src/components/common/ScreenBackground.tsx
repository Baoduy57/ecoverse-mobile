import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Background trang giống màn Profile - decorative circles + floating icons
 */
export default function ScreenBackground() {
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim1, floatAnim2, floatAnim3]);

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.bgDecorativeTop} />
      <View style={styles.bgDecorativeRight} />
      <View style={styles.bgDecorativeBottom} />

      <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatAnim1 }] }]}>
        <MaterialCommunityIcons name="leaf" size={100} color="rgba(129, 199, 132, 0.4)" />
      </Animated.View>
      <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatAnim2 }] }]}>
        <MaterialCommunityIcons name="recycle" size={80} color="rgba(129, 199, 132, 0.4)" />
      </Animated.View>
      <Animated.View style={[styles.floatingIcon3, { transform: [{ translateY: floatAnim3 }] }]}>
        <MaterialCommunityIcons name="cloud" size={60} color="rgba(144, 202, 249, 0.5)" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  bgDecorativeTop: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '70%',
    height: '40%',
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    opacity: 0.7,
  },
  bgDecorativeRight: {
    position: 'absolute',
    right: '-20%',
    top: '40%',
    width: '80%',
    height: '50%',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 9999,
  },
  bgDecorativeBottom: {
    position: 'absolute',
    bottom: '-10%',
    left: '10%',
    width: '60%',
    height: '40%',
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    opacity: 0.6,
  },
  floatingIcon1: {
    position: 'absolute',
    right: -20,
    top: '15%',
    zIndex: 0,
  },
  floatingIcon2: {
    position: 'absolute',
    bottom: '20%',
    left: -30,
    zIndex: 0,
  },
  floatingIcon3: {
    position: 'absolute',
    left: '5%',
    top: '40%',
    zIndex: 0,
  },
});
