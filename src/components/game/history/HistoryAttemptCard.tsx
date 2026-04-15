import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, colors, spacing } from '../../../theme';
import type { IGameAttempt } from '../../../types';

export type PlacementStats = {
  total: number;
  correct: number;
};

interface HistoryAttemptCardProps {
  attempt: IGameAttempt;
  stats?: PlacementStats;
  onReplay: (attempt: IGameAttempt) => void;
  onViewDetails: (attempt: IGameAttempt) => void;
}

const formatDuration = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function HistoryAttemptCard({
  attempt,
  stats,
  onReplay,
  onViewDetails,
}: HistoryAttemptCardProps) {
  const progressRatio = useMemo(() => {
    if (!stats || stats.total <= 0) return 0;
    return Math.min(1, Math.max(0, stats.correct / stats.total));
  }, [stats]);

  return (
    <View style={styles.cardWrap}>
      <LinearGradient
        colors={['#FFFFFF', '#F5FFF5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {attempt.title_game_round}
          </Text>
          <View style={styles.roundBadge}>
            <MaterialCommunityIcons name="flag-checkered" size={14} color={colors.primaryDark} />
            <Text style={styles.roundBadgeText}>Lần {attempt.attempt_number}</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="star" size={16} color={colors.accent} />
            <Text style={styles.metricText}>{attempt.points_earned} điểm</Text>
          </View>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="timer-outline" size={16} color={colors.primary} />
            <Text style={styles.metricText}>{formatDuration(attempt.duration)}</Text>
          </View>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="playlist-check" size={16} color={colors.primaryDark} />
            <Text style={styles.metricText}>
              {stats ? `${stats.correct}/${stats.total}` : '--/--'} đúng
            </Text>
          </View>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons
              name={attempt.completed ? 'check-circle' : 'progress-clock'}
              size={16}
              color={attempt.completed ? colors.status.success : colors.status.warning}
            />
            <Text style={styles.metricText}>
              {attempt.completed ? 'Đã hoàn thành' : 'Đang chơi'}
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onViewDetails(attempt)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="file-document-outline" size={18} color={colors.primary} />
            <Text style={styles.detailButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.replayButton}
            onPress={() => onReplay(attempt)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#4CAF50', '#3E9F45']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.replayButtonInner}
            >
              <MaterialCommunityIcons name="refresh" size={18} color={colors.text.white} />
              <Text style={styles.replayButtonText}>Chơi lại</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  card: {
    borderColor: '#E5EFE4',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.base,
  },
  cardWrap: {
    marginBottom: spacing.base,
  },
  detailButton: {
    alignItems: 'center',
    backgroundColor: '#EEF7F0',
    borderColor: '#CFE7D2',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.base,
  },
  detailButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minWidth: '45%',
  },
  metricText: {
    color: '#4A5E4E',
    fontSize: 14,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    height: '100%',
  },
  progressTrack: {
    backgroundColor: '#E9F5EA',
    borderRadius: borderRadius.full,
    height: 8,
    overflow: 'hidden',
  },
  replayButton: {
    flex: 1.25,
  },
  replayButtonInner: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: spacing.sm,
  },
  replayButtonText: {
    color: colors.text.white,
    fontSize: 17,
    fontWeight: '900',
  },
  roundBadge: {
    alignItems: 'center',
    backgroundColor: '#E9F6EA',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  roundBadgeText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  title: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
});
