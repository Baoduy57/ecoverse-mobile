import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../../theme';
import ScreenBackground from '../../common/ScreenBackground';

interface GamePlayResultProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  onViewDetails: () => void;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function GamePlayResult({
  score,
  correctAnswers,
  totalQuestions,
  onViewDetails,
  onPlayAgain,
  onGoHome,
}: GamePlayResultProps) {
  return (
    <View style={styles.resultContainer}>
      <ScreenBackground />
      <SafeAreaView style={styles.resultSafeArea}>
        <View style={styles.starsContainer}>
          <MaterialCommunityIcons key="star-1" name="star" size={80} color={colors.accent} />
          <MaterialCommunityIcons key="star-2" name="star" size={100} color={colors.accent} />
          <MaterialCommunityIcons key="star-3" name="star" size={80} color={colors.accent} />
        </View>

        <Text style={styles.resultTitle}>NHIỆM VỤ{'\n'}HOÀN THÀNH!</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Tổng điểm</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={colors.status.success} />
              <Text style={styles.statLabel}>Trả lời đúng</Text>
              <Text style={styles.statValue}>
                {correctAnswers}/{totalQuestions}
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.accent} />
              <Text style={styles.statLabel}>Liên tiếp cao</Text>
              <Text style={styles.statValue}>{correctAnswers}x</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.viewDetailButton} onPress={onViewDetails}>
          <MaterialCommunityIcons name="format-list-checks" size={24} color={colors.primary} />
          <Text style={styles.viewDetailButtonText}>Xem chi tiết câu trả lời</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playAgainButton} onPress={onPlayAgain}>
          <MaterialCommunityIcons name="refresh" size={24} color={colors.text.white} />
          <Text style={styles.playAgainButtonText}>CHƠI LẠI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
          <MaterialCommunityIcons name="home" size={24} color={colors.text.white} />
          <Text style={styles.homeButtonText}>VỀ TRANG CHỦ</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    position: 'relative',
  },
  resultSafeArea: {
    flex: 1,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: spacing.xl,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    width: '100%',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  viewDetailButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    width: '100%',
    marginBottom: spacing.md,
  },
  playAgainButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    width: '100%',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
  },
});
