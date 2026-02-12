import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import type { ILeaderboardEntry } from '../../types/game';

interface RankingItemProps {
  entry: ILeaderboardEntry;
  isCurrentUser?: boolean;
}

export default function RankingItem({ entry, isCurrentUser }: RankingItemProps) {
  const containerStyle = isCurrentUser
    ? [styles.container, styles.currentUserContainer]
    : styles.container;

  return (
    <TouchableOpacity style={containerStyle} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <Text style={styles.rank}>{entry.rank}</Text>
        {entry.avatar ? (
          <Image source={{ uri: entry.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialCommunityIcons name="account" size={24} color={colors.text.secondary} />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {entry.userName}
            {isCurrentUser && <Text style={styles.youBadge}> (Bạn)</Text>}
          </Text>
          {entry.level && <Text style={styles.subtitle}>Level {entry.level}</Text>}
        </View>
      </View>
      <View style={styles.pointsContainer}>
        <MaterialCommunityIcons name="poker-chip" size={18} color="#FFA726" />
        <Text style={styles.points}>{entry.points.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  currentUserContainer: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
    minWidth: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarPlaceholder: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  youBadge: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  points: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});
