import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../../theme';

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
  currentQuestionIndex?: number;
  totalQuestions?: number;
}

export default function GamePlayHeader({
  timer,
  combo,
  score,
  onPause,
  onSettings,
  currentQuestionIndex = 0,
  totalQuestions = 1,
}: GamePlayHeaderProps) {
  const progress = totalQuestions > 0 ? currentQuestionIndex / totalQuestions : 0;

  return (
    <View style={styles.headerWrapper}>
      {/* Top row: Close | Title | Settings */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={onPause} activeOpacity={0.8}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.titleText}>PHÂN LOẠI RÁC</Text>

        <TouchableOpacity style={styles.iconButton} onPress={onSettings || onPause} activeOpacity={0.8}>
          <MaterialCommunityIcons name="cog" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats row: Timer | Score | Combo */}
      <View style={styles.statsRow}>
        {/* Timer */}
        <View style={styles.timerPill}>
          <MaterialCommunityIcons
            name="timer-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>ĐIỂM SỐ</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
        </View>

        {/* Combo */}
        <View style={[styles.comboPill, combo > 0 && styles.comboPillActive]}>
          <Text style={[styles.comboText, combo > 0 && styles.comboTextActive]}>Combo x{combo}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <LinearGradient
            colors={['#81C784', '#4CAF50']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${Math.max(5, progress * 100)}%` }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comboPill: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  comboPillActive: {
    backgroundColor: '#81C784',
  },
  comboText: {
    color: '#81C784',
    fontSize: 16,
    fontWeight: 'bold',
  },
  comboTextActive: {
    color: colors.text.white,
  },
  headerWrapper: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  progressBackground: {
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  progressContainer: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  progressFill: {
    borderRadius: 6,
    height: '100%',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreLabel: {
    color: '#757575',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scoreValue: {
    color: '#2E7D32',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  timerPill: {
    alignItems: 'center',
    backgroundColor: '#DcedC8',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timerText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleText: {
    color: '#1B5E20',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
