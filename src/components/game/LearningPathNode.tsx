import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import type { Level } from '../../types/game';

interface LearningPathNodeProps {
  level: Level;
  position: { x: number; y: number };
  onPress: (level: Level) => void;
}

export default function LearningPathNode({
  level,
  position,
  onPress,
}: LearningPathNodeProps) {
  const { x, y } = position;
  const isCurrent = Boolean(level.isCurrent);
  const hasPlayed = (level.playsCount ?? 0) > 0;

  // Animation for current node
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCurrent) {
      const pulse = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ]),
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -5,
              duration: 1000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ]),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    }
  }, [isCurrent, scale, translateY]);

  const backgroundColor = isCurrent || hasPlayed ? colors.primary : colors.surface;

  const iconColor = isCurrent ? colors.surface : hasPlayed ? colors.accent : colors.primary;

  // Border color:
  // - Current: Green (thicker)
  // - Others: Light gray
  const borderColor = isCurrent ? colors.primary : '#E0E0E0';

  const nodeSize = isCurrent ? 80 : 70;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x - nodeSize / 2,
          top: y - nodeSize / 2,
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(level)}
        style={[
          styles.node,
          {
            width: nodeSize,
            height: nodeSize,
            borderRadius: nodeSize / 2,
            backgroundColor,
            borderColor,
            borderWidth: isCurrent ? 6 : 4,
            elevation: 8, // Shadow for all nodes
            shadowOpacity: 0.3,
            shadowRadius: 10,
          },
        ]}
      >
        {/* Main Icon */}
        <MaterialCommunityIcons
          name={level.icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={isCurrent ? 36 : 32}
          color={iconColor}
        />
      </TouchableOpacity>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{level.title}</Text>
      </View>

      {/* Best Score */}
      {level.bestScore && hasPlayed && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Best {level.bestScore}</Text>
        </View>
      )}

      {/* START Badge */}
      {level.isCurrent && (
        <View style={styles.startBadge}>
          <MaterialCommunityIcons name="fire" size={12} color={colors.text.primary} />
          <Text style={styles.startText}>START</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
  },
  labelContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    elevation: 2,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  labelText: {
    color: colors.text.primary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 }, // Increased offset for floating effect
  },
  scoreContainer: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scoreText: {
    color: colors.text.secondary,
    fontSize: 10,
    fontWeight: '600',
  },
  startBadge: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    elevation: 4,
    flexDirection: 'row',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: -12,
  },
  startText: {
    color: colors.text.primary,
    fontSize: 9,
    fontWeight: '800',
  },
});
