import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface OnboardingSlideData {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  gradient: [string, string];
  bgColor: string;
  tag: string;
}

interface OnboardingSlideProps {
  item: OnboardingSlideData;
  isActive: boolean;
}

const FloatingParticle = ({
  x,
  delay,
  color,
}: {
  x: number;
  delay: number;
  color: string;
}) => {
  const yAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(yAnim, { toValue: -60, duration: 2200, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacityAnim, { toValue: 0.7, duration: 500, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 1700, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(yAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 20,
        left: x,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: color,
        opacity: opacityAnim,
        transform: [{ translateY: yAnim }],
      }}
    />
  );
};

const IconOrb = ({
  icon,
  gradient,
  isActive,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  gradient: [string, string];
  isActive: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (isActive) {
      // Entry animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // Gentle bob loop
      const bob = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.06, duration: 1400, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        ])
      );
      const timer = setTimeout(() => bob.start(), 400);

      // Glow pulse
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.6, duration: 1200, useNativeDriver: true }),
        ])
      );
      glow.start();

      // Slow rotation
      const spin = Animated.loop(
        Animated.timing(rotateAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
      );
      spin.start();

      return () => {
        clearTimeout(timer);
        bob.stop();
        glow.stop();
        spin.stop();
      };
    } else {
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }).start();
    }
  }, [isActive]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.orbWrapper}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.orbGlowOuter,
          { borderColor: gradient[0], opacity: glowAnim },
        ]}
      />
      <Animated.View
        style={[
          styles.orbGlowInner,
          { borderColor: gradient[0] + '80', opacity: glowAnim },
        ]}
      />

      {/* Rotating ring decorations */}
      <Animated.View style={[styles.orbRing, { borderColor: gradient[1] + '60', transform: [{ rotate }] }]}>
        <View style={[styles.orbRingDot, { backgroundColor: gradient[0] }]} />
      </Animated.View>

      {/* Main orb */}
      <Animated.View
        style={[
          styles.orbMain,
          {
            backgroundColor: gradient[0],
            transform: [{ scale: scaleAnim }],
            shadowColor: gradient[0],
          },
        ]}
      >
        {/* Inner highlight */}
        <View style={styles.orbHighlight} />
        <MaterialCommunityIcons name={icon} size={72} color="#FFFFFF" />
      </Animated.View>
    </View>
  );
};

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ item, isActive }) => {
  const contentAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(contentAnim, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 450, delay: 200, useNativeDriver: true }),
      ]).start();
    } else {
      contentAnim.setValue(0);
      slideAnim.setValue(30);
    }
  }, [isActive]);

  const particles = [
    { x: width * 0.15, delay: 0 },
    { x: width * 0.35, delay: 700 },
    { x: width * 0.55, delay: 300 },
    { x: width * 0.75, delay: 1100 },
  ];

  return (
    <View style={styles.slide}>
      {/* Background blob */}
      <View style={[styles.blobBg, { backgroundColor: item.bgColor }]} />

      {/* Particle effects */}
      {isActive && particles.map((p, i) => (
        <FloatingParticle key={i} x={p.x} delay={p.delay} color={item.gradient[0]} />
      ))}

      {/* Icon section */}
      <View style={styles.iconSection}>
        <IconOrb icon={item.icon} gradient={item.gradient} isActive={isActive} />
      </View>

      {/* Text content */}
      <Animated.View
        style={[
          styles.textSection,
          { opacity: contentAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Tag pill */}
        <View style={[styles.tagPill, { backgroundColor: item.gradient[0] + '18' }]}>
          <View style={[styles.tagDot, { backgroundColor: item.gradient[0] }]} />
          <Text style={[styles.tagText, { color: item.gradient[0] }]}>{item.tag}</Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

export type { OnboardingSlideData };

const styles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    overflow: 'hidden',
  },
  blobBg: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.25,
  },
  // Orb
  orbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    height: 240,
  },
  orbGlowOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
  },
  orbGlowInner: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
  },
  orbRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    borderStyle: 'dashed',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orbRingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: -5,
  },
  orbMain: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 20,
    overflow: 'hidden',
  },
  orbHighlight: {
    position: 'absolute',
    top: 16,
    left: 24,
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.28)',
    transform: [{ rotate: '-30deg' }],
  },
  // Icon section
  iconSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Text
  textSection: {
    alignItems: 'center',
    paddingBottom: 16,
    width: '100%',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 18,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#5A5A7A',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
});
