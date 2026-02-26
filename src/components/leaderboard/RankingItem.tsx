import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import type { ILeaderboardEntry } from '../../types/game';

const RANK_STYLE: Record<number, { bg: string; color: string }> = {
  4: { bg: 'rgba(33, 150, 243, 0.12)', color: colors.accentBlue },
  5: { bg: 'rgba(156, 39, 176, 0.12)', color: colors.accentPurple },
};

function getRankStyle(rank: number) {
  return RANK_STYLE[rank] || { bg: colors.background, color: colors.text.secondary };
}

interface RankingItemProps {
  entry: ILeaderboardEntry;
  isCurrentUser?: boolean;
}

export default function RankingItem({ entry, isCurrentUser }: RankingItemProps) {
  const rankStyle = getRankStyle(entry.rank);

  return (
    <TouchableOpacity
      style={[styles.container, isCurrentUser && styles.currentUserContainer]}
      activeOpacity={0.8}
    >
      <View style={[styles.rankBadge, { backgroundColor: rankStyle.bg }]}>
        <Text style={[styles.rankText, { color: rankStyle.color }]}>{entry.rank}</Text>
      </View>
      <View style={styles.avatarWrap}>
        {entry.avatar ? (
          <Image source={{ uri: entry.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialCommunityIcons name="account" size={24} color={colors.text.secondary} />
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {entry.userName}
          </Text>
          {isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>Bạn</Text>
            </View>
          )}
        </View>
        {entry.level != null && <Text style={styles.subtitle}>Level {entry.level}</Text>}
      </View>
      <View style={styles.pointsChip}>
        <MaterialCommunityIcons name="star-four-points" size={16} color={colors.accent} />
        <Text style={styles.points}>{entry.points.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rankText: {
    fontSize: 20,
    fontWeight: '800',
  },
  avatarWrap: {
    marginRight: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  youBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  youBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  pointsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 174, 0, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  points: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
});
