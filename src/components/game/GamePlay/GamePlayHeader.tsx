import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../../theme';
import { GAME_HEADER_LABELS } from '../../../data/dragDropGameData';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

interface GamePlayHeaderProps {
  gameModeLabel: string;
  timer: number;
  timeLimit: number;
  combo: number;
  score: number;
  onPause: () => void;
  onSettings?: () => void;
}

export default function GamePlayHeader({
  gameModeLabel,
  timer,
  timeLimit,
  combo,
  score,
  onPause,
  onSettings,
}: GamePlayHeaderProps) {
  const isTimerWarning = timer <= 10;

  return (
    <View style={styles.headerWrapper}>
      {/* Top row: Pause | Game Mode | Settings */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.pauseButton} onPress={onPause} activeOpacity={0.8}>
          <MaterialCommunityIcons name="pause" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.gameModeBadge}>
          <Text style={styles.gameModeText}>{gameModeLabel}</Text>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onSettings || onPause}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="cog" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Bottom row: Timer | Combo | Score */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.timerCard, isTimerWarning && styles.timerWarning]}>
          <View style={styles.statContent}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={isTimerWarning ? colors.status.error : colors.text.secondary}
            />
            <Text style={[styles.statValue, isTimerWarning && styles.timerTextWarning]}>
              {formatTime(timer)}
            </Text>
          </View>
          <Text style={styles.statLabel}>{GAME_HEADER_LABELS.time}</Text>
        </View>

        <View style={styles.comboCard}>
          <Text style={styles.comboValue}>x{combo}</Text>
          <Text style={styles.comboLabel}>{GAME_HEADER_LABELS.combo}</Text>
        </View>

        <View style={[styles.statCard, styles.scoreCard]}>
          <View style={styles.statContent}>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
            <View style={styles.trophyWrap}>
              <MaterialCommunityIcons name="trophy" size={20} color={colors.text.white} />
            </View>
          </View>
          <Text style={styles.scoreStatLabel}>{GAME_HEADER_LABELS.score}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  pauseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gameModeBadge: {
    flex: 1,
    marginHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gameModeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  timerCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.08)',
  },
  timerWarning: {
    backgroundColor: 'rgba(244, 67, 54, 0.12)',
  },
  timerTextWarning: {
    color: colors.status.error,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 2,
  },
  comboCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comboValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF9800',
  },
  comboLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9800',
    marginTop: 2,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  trophyWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  scoreCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
});
