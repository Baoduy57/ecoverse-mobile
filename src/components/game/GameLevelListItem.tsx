import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../../theme';
import type { Level } from '../../types/game';

interface GameLevelListItemProps {
  level: Level;
  index: number;
  onPlayPress: (level: Level) => void;
  onHistoryPress: (level: Level) => void;
}

export default function GameLevelListItem({
  level,
  index,
  onPlayPress,
  onHistoryPress,
}: GameLevelListItemProps) {
  const isCompleted = (level.playsCount ?? 0) > 0;
  const gradientColors = colors.gameCardGradients[index % colors.gameCardGradients.length];

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Decorative bubbles */}
        <View style={styles.glowBubbleLarge} />
        <View style={styles.glowBubbleSmall} />

        {/* Top: Icon + Info */}
        <View style={styles.infoRow}>
          <View style={styles.iconBubble}>
            <MaterialCommunityIcons
              name={(level.icon as keyof typeof MaterialCommunityIcons.glyphMap) || 'leaf'}
              size={32}
              color={colors.text.white}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.levelNumber}>MÀN {index + 1}</Text>
            <Text numberOfLines={2} style={styles.title}>
              {level.title}
            </Text>
            {!!level.description && (
              <Text numberOfLines={1} style={styles.description}>
                {level.description}
              </Text>
            )}

            {/* Status badge */}
            <View style={[styles.statusBadge, isCompleted ? styles.badgeCompleted : styles.badgeNew]}>
              <MaterialCommunityIcons
                name={isCompleted ? 'check-circle' : 'star-four-points'}
                size={12}
                color={colors.text.white}
              />
              <Text style={styles.statusText}>
                {isCompleted ? 'Đã hoàn thành' : 'Màn mới'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom: Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => onHistoryPress(level)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <MaterialCommunityIcons name="history" size={17} color={colors.text.white} />
            <Text style={styles.historyButtonText}>Lịch sử</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => onPlayPress(level)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <MaterialCommunityIcons name="play" size={18} color={gradientColors[1]} />
            <Text style={[styles.playButtonText, { color: gradientColors[1] }]}>
              {isCompleted ? 'Chơi lại' : 'Bắt đầu'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 20,
    height: 58,
    justifyContent: 'center',
    width: 58,
    flexShrink: 0,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  levelNumber: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 21,
    marginBottom: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  badgeCompleted: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  badgeNew: {
    backgroundColor: 'rgba(255,235,59,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.6)',
  },
  statusText: {
    color: colors.text.white,
    fontSize: 11,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  historyButtonText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '700',
  },
  playButton: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  playButtonText: {
    fontSize: 15,
    fontWeight: '900',
  },
  glowBubbleLarge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
    height: 150,
    position: 'absolute',
    right: -30,
    top: -30,
    width: 150,
  },
  glowBubbleSmall: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 60,
    bottom: -20,
    height: 80,
    position: 'absolute',
    right: 80,
    width: 80,
  },
});
