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
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
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
    maxWidth: 110,
  },
  centerPosition: {
    flex: 1.15,
    alignItems: 'center',
    maxWidth: 130,
  },
  podiumItem: {
    alignItems: 'center',
    width: '100%',
  },
  placeholderItem: {
    alignItems: 'center',
    width: '100%',
  },
  podiumItemFirst: {
    marginBottom: -4,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  avatarPlaceholder: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderEmpty: {
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  crownBadge: {
    position: 'absolute',
    top: -14,
    left: '50%',
    marginLeft: -14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medalBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  medalText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '800',
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  podiumNameFirst: {
    fontSize: 15,
    fontWeight: '700',
  },
  pointsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 174, 0, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  podiumPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: spacing.sm,
    minHeight: 40,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  rankLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  rankPlaceholder: {
    fontSize: 20,
    color: colors.text.disabled,
    marginTop: 8,
  },
});
