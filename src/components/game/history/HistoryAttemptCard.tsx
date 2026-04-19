import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { borderRadius, colors, spacing } from '../../../theme';
import type { IGameAttempt } from '../../../types';
import { parseApiDate } from '../../../utils/helpers';

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

const formatDate = (attempt: IGameAttempt) => {
  const value =
    attempt.updated_at || attempt.completed_at || attempt.created_at || attempt.started_at;
  const d = parseApiDate(value);
  if (!d) return '--/--/---- --:--';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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

  const accuracy = stats && stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;
  const isCompleted = Boolean(attempt.completed);

  return (
    <View style={styles.card}>
      {/* Top row: title + attempt badge */}
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.roundLabel}>LẦN CHƠI #{attempt.attempt_number}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {attempt.title_game_round}
          </Text>
          <Text style={styles.dateText}>{formatDate(attempt)}</Text>
        </View>

        <View style={[styles.statusBadge, isCompleted ? styles.badgeDone : styles.badgeProgress]}>
          <MaterialCommunityIcons
            name={isCompleted ? 'check-circle' : 'progress-clock'}
            size={14}
            color={isCompleted ? colors.primaryDark : colors.secondary}
          />
          <Text style={[styles.statusText, isCompleted ? styles.statusDone : styles.statusProgress]}>
            {isCompleted ? 'Hoàn thành' : 'Chưa xong'}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="star" size={18} color={colors.accent} />
          <Text style={styles.statValue}>{attempt.points_earned}</Text>
          <Text style={styles.statLabel}>điểm</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="timer-outline" size={18} color={colors.accentBlue} />
          <Text style={styles.statValue}>{formatDuration(attempt.duration)}</Text>
          <Text style={styles.statLabel}>thời gian</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="bullseye-arrow" size={18} color={colors.primaryDark} />
          <Text style={styles.statValue}>
            {accuracy !== null ? `${accuracy}%` : '--'}
          </Text>
          <Text style={styles.statLabel}>chính xác</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="format-list-checks" size={18} color={colors.text.secondary} />
          <Text style={styles.statValue}>
            {stats ? `${stats.correct}/${stats.total}` : '--'}
          </Text>
          <Text style={styles.statLabel}>đúng</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => onViewDetails(attempt)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="file-document-outline" size={17} color={colors.primaryDark} />
          <Text style={styles.detailButtonText}>Chi tiết</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.replayButton}
          onPress={() => onReplay(attempt)}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="refresh" size={17} color={colors.text.white} />
          <Text style={styles.replayButtonText}>Chơi lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.divider,
    marginBottom: spacing.base,
    padding: spacing.base,
    gap: spacing.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  roundLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text.primary,
    lineHeight: 22,
  },
  dateText: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    flexShrink: 0,
  },
  badgeDone: {
    backgroundColor: '#E8F5E9',
  },
  badgeProgress: {
    backgroundColor: '#FFF8E1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusDone: {
    color: colors.primaryDark,
  },
  statusProgress: {
    color: colors.secondary,
  },
  progressTrack: {
    backgroundColor: colors.divider,
    borderRadius: borderRadius.full,
    height: 7,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    height: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.divider,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    backgroundColor: '#F0FBF1',
  },
  detailButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  replayButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
  },
  replayButtonText: {
    color: colors.text.white,
    fontSize: 15,
    fontWeight: '900',
  },
});
