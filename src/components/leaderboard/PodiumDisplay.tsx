import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import type { ILeaderboardEntry } from '../../types/game';

interface PodiumDisplayProps {
  top3: [ILeaderboardEntry?, ILeaderboardEntry?, ILeaderboardEntry?];
}

export default function PodiumDisplay({ top3 }: PodiumDisplayProps) {
  const [first, second, third] = top3;

  const renderPodiumItem = (
    entry: ILeaderboardEntry | undefined,
    rank: number,
    height: number,
    color: string
  ) => {
    if (!entry) return null;

    const iconColor = rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32';

    return (
      <View style={styles.podiumItem}>
        <View style={styles.avatarContainer}>
          {entry.avatar ? (
            <Image source={{ uri: entry.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialCommunityIcons name="account" size={32} color={colors.text.secondary} />
            </View>
          )}
          {rank === 1 && (
            <View style={styles.crownBadge}>
              <MaterialCommunityIcons name="crown" size={24} color={iconColor} />
            </View>
          )}
          {rank !== 1 && (
            <View style={[styles.medalBadge, { backgroundColor: iconColor }]}>
              <Text style={styles.medalText}>{rank}</Text>
            </View>
          )}
        </View>
        <Text style={styles.podiumName} numberOfLines={1}>
          {entry.userName}
        </Text>
        <View style={styles.pointsContainer}>
          <MaterialCommunityIcons name="poker-chip" size={16} color="#FFA726" />
          <Text style={styles.podiumPoints}>{entry.points.toLocaleString()}</Text>
        </View>
        <View style={[styles.podiumBase, { backgroundColor: color, height }]}>
          <Text style={styles.rankNumber}>{rank}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.podiumRow}>
        {/* 2nd Place - Left */}
        <View style={styles.sidePosition}>{renderPodiumItem(second, 2, 100, '#E0E0E0')}</View>

        {/* 1st Place - Center */}
        <View style={styles.centerPosition}>{renderPodiumItem(first, 1, 130, '#FFD700')}</View>

        {/* 3rd Place - Right */}
        <View style={styles.sidePosition}>{renderPodiumItem(third, 3, 80, '#CD7F32')}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  sidePosition: {
    flex: 1,
    alignItems: 'center',
  },
  centerPosition: {
    flex: 1,
    alignItems: 'center',
  },
  podiumItem: {
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  avatarPlaceholder: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -12,
  },
  medalBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  medalText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  podiumPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rankNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.surface,
  },
});
