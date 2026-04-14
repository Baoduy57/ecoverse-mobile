import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import type { ILeaderboardEntry } from '../../types/leaderboard';

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
  const subtitleParts: string[] = [];

  if (entry.grade) {
    subtitleParts.push('Lop ' + entry.grade);
  }

  if (typeof entry.minDuration === 'number' && entry.minDuration > 0) {
    subtitleParts.push('Nhanh nhat ' + entry.minDuration + 's');
  }

  if (!subtitleParts.length && typeof entry.level === 'number' && entry.level > 0) {
    subtitleParts.push('Level ' + entry.level);
  }

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
        {subtitleParts.length > 0 && (
          <Text style={styles.subtitle}>{subtitleParts.join(' • ')}</Text>
        )}
      </View>
      <View style={styles.pointsChip}>
        <MaterialCommunityIcons name="star-four-points" size={16} color={colors.accent} />
        <Text style={styles.points}>{entry.points.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  avatarWrap: {
    marginRight: spacing.sm,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  currentUserContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  points: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  pointsChip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 174, 0, 0.12)',
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rankBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 44,
  },
  rankText: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  youBadge: {
    backgroundColor: colors.primaryDark,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: borderRadius.base,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  youBadgeText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
