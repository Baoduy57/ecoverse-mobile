import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import type { ILeaderboardEntry } from '../../types/game';

const RANK_CONFIG = {
  1: {
    medalColor: '#FFD700',
    baseColor: '#FFF8E1',
    baseBorder: 'rgba(255, 215, 0, 0.4)',
    height: 90,
    label: 'Nhất',
    icon: 'trophy' as const,
  },
  2: {
    medalColor: '#B0BEC5',
    baseColor: '#ECEFF1',
    baseBorder: 'rgba(176, 190, 197, 0.5)',
    height: 75,
    label: 'Nhì',
    icon: 'medal' as const,
  },
  3: {
    medalColor: '#BC8F5C',
    baseColor: '#FFF3E0',
    baseBorder: 'rgba(188, 143, 92, 0.4)',
    height: 66,
    label: 'Ba',
    icon: 'medal-outline' as const,
  },
};

interface PodiumDisplayProps {
  top3: [ILeaderboardEntry?, ILeaderboardEntry?, ILeaderboardEntry?];
}

export default function PodiumDisplay({ top3 }: PodiumDisplayProps) {
  const [first, second, third] = top3;

  const renderPodiumItem = (entry: ILeaderboardEntry | undefined, rank: 1 | 2 | 3) => {
    if (!entry) {
      return (
        <View style={styles.placeholderItem}>
          <View style={[styles.avatarWrap, styles.avatarPlaceholderEmpty]} />
          <View
            style={[
              styles.podiumBase,
              { height: RANK_CONFIG[rank].height, backgroundColor: RANK_CONFIG[rank].baseColor },
            ]}
          >
            <Text style={styles.rankPlaceholder}>—</Text>
          </View>
        </View>
      );
    }

    const config = RANK_CONFIG[rank];
    const isFirst = rank === 1;
    const avatarSize = isFirst ? 80 : 72;
    const avatarInner = isFirst ? 74 : 66;

    return (
      <View style={[styles.podiumItem, isFirst && styles.podiumItemFirst]}>
        <View
          style={[
            styles.avatarWrap,
            {
              borderColor: config.medalColor,
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        >
          {entry.avatar ? (
            <Image
              source={{ uri: entry.avatar }}
              style={[
                styles.avatar,
                { width: avatarInner, height: avatarInner, borderRadius: avatarInner / 2 },
              ]}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                styles.avatarPlaceholder,
                { width: avatarInner, height: avatarInner, borderRadius: avatarInner / 2 },
              ]}
            >
              <MaterialCommunityIcons
                name="account"
                size={isFirst ? 36 : 30}
                color={colors.text.secondary}
              />
            </View>
          )}
          {isFirst ? (
            <View style={styles.crownBadge}>
              <MaterialCommunityIcons name="crown" size={28} color={config.medalColor} />
            </View>
          ) : (
            <View style={[styles.medalBadge, { backgroundColor: config.medalColor }]}>
              <Text style={styles.medalText}>{rank}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.podiumName, isFirst && styles.podiumNameFirst]} numberOfLines={1}>
          {entry.userName}
        </Text>
        <View style={styles.pointsChip}>
          <MaterialCommunityIcons name="star-four-points" size={14} color={colors.accent} />
          <Text style={styles.podiumPoints}>{entry.points.toLocaleString()}</Text>
        </View>
        <View
          style={[
            styles.podiumBase,
            {
              height: config.height,
              backgroundColor: config.baseColor,
              borderColor: config.baseBorder,
            },
          ]}
        >
          <View style={[styles.rankBadge, { backgroundColor: config.medalColor }]}>
            <MaterialCommunityIcons name={config.icon} size={18} color={colors.text.white} />
          </View>
          <Text style={styles.rankLabel}>{config.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.podiumRow}>
        <View style={styles.sidePosition}>{renderPodiumItem(second, 2)}</View>
        <View style={styles.centerPosition}>{renderPodiumItem(first, 1)}</View>
        <View style={styles.sidePosition}>{renderPodiumItem(third, 3)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 33,
    height: 66,
    width: 66,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  avatarPlaceholderEmpty: {
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  avatarWrap: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 36,
    borderWidth: 3,
    elevation: 3,
    height: 72,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 72,
  },
  centerPosition: {
    alignItems: 'center',
    flex: 1.15,
    maxWidth: 130,
  },
  container: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  crownBadge: {
    elevation: 2,
    left: '50%',
    marginLeft: -14,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    top: -14,
  },
  medalBadge: {
    alignItems: 'center',
    borderColor: colors.surface,
    borderRadius: 13,
    borderWidth: 2,
    bottom: -6,
    height: 26,
    justifyContent: 'center',
    position: 'absolute',
    right: -6,
    width: 26,
  },
  medalText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '800',
  },
  placeholderItem: {
    alignItems: 'center',
    width: '100%',
  },
  podiumBase: {
    alignItems: 'center',
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    justifyContent: 'flex-start',
    minHeight: 40,
    paddingTop: spacing.sm,
    width: '100%',
  },
  podiumItem: {
    alignItems: 'center',
    width: '100%',
  },
  podiumItemFirst: {
    marginBottom: -4,
  },
  podiumName: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    paddingHorizontal: 2,
    textAlign: 'center',
  },
  podiumNameFirst: {
    fontSize: 15,
    fontWeight: '700',
  },
  podiumPoints: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  podiumRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  pointsChip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 174, 0, 0.12)',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 4,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  rankBadge: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginBottom: 4,
    width: 32,
  },
  rankLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rankPlaceholder: {
    color: colors.text.disabled,
    fontSize: 20,
    marginTop: 8,
  },
  sidePosition: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 110,
  },
});
