import React, { useRef } from 'react';
import { View, StyleSheet, Pressable, Animated, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@theme';
import { LinearGradient } from 'expo-linear-gradient';

interface GameCardProps {
  title: string;
  icon: string;
  buttonText: string;
  buttonIcon: string;
  backgroundColor: string;
  onPress?: () => void;
  illustration?: any; // Image source for background illustration
}

export default function GameCard({
  title,
  icon,
  buttonText,
  buttonIcon,
  backgroundColor,
  onPress,
  illustration,
}: GameCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.container}
    >
      <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.card, { backgroundColor }]}>
          {/* Background Decorative Blurs */}
          <View style={styles.blurTopRight} />
          <View style={styles.blurBottomLeft} />

          {/* Background Illustration */}
          {illustration && (
            <View style={styles.illustrationContainer}>
              <ImageBackground
                source={illustration}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            {/* Icon Container */}
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                style={styles.iconContainer}
              >
                <MaterialCommunityIcons name={icon as any} size={24} color={colors.text.white} />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text variant="titleMedium" style={styles.title}>
              {title}
            </Text>
          </View>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <MaterialCommunityIcons name={buttonIcon as any} size={18} color={backgroundColor} />
              <Text variant="labelMedium" style={[styles.buttonText, { color: backgroundColor }]}>
                {buttonText}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    borderRadius: borderRadius.xl,
    elevation: 8,
    flex: 1,
    minHeight: 224,
    overflow: 'hidden',
    padding: spacing.base,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  // Background decorative blurs
  blurTopRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 64,
    height: 128,
    opacity: 0.8,
    position: 'absolute',
    right: -40,
    top: -40,
    width: 128,
  },
  blurBottomLeft: {
    backgroundColor: 'rgba(255, 235, 59, 0.2)',
    borderRadius: 48,
    bottom: -20,
    height: 96,
    left: -20,
    opacity: 0.6,
    position: 'absolute',
    width: 96,
  },
  // Background illustration
  illustrationContainer: {
    bottom: 0,
    height: '100%',
    position: 'absolute',
    right: 0,
    width: '100%',
    zIndex: 1,
  },
  illustration: {
    height: '100%',
    opacity: 0.6,
    width: '110%',
  },
  // Content
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: spacing.sm,
    zIndex: 10,
  },
  iconWrapper: {
    marginBottom: spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    elevation: 2,
    height: 48,
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 48,
  },
  title: {
    color: colors.text.white,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    lineHeight: 22,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Button
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: spacing.xs,
    zIndex: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    elevation: 4,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
