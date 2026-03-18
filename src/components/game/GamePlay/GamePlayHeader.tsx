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
  comboCard: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  comboLabel: {
    color: '#FF9800',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  comboValue: {
    color: '#FF9800',
    fontSize: 28,
    fontWeight: '800',
  },
  gameModeBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    elevation: 2,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  gameModeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  headerWrapper: {
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  pauseButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: 22,
    borderWidth: 2,
    elevation: 2,
    height: 44,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 44,
  },
  scoreCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  scoreStatLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  scoreValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    elevation: 2,
    height: 44,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 44,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 2,
    flex: 1,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timerCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.08)',
  },
  timerTextWarning: {
    color: colors.status.error,
  },
  timerWarning: {
    backgroundColor: 'rgba(244, 67, 54, 0.12)',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  trophyWrap: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
});
