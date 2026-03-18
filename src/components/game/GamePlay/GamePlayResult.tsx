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
  homeButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    width: '100%',
  },
  homeButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
  playAgainButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    width: '100%',
  },
  playAgainButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
  resultContainer: {
    backgroundColor: '#E8F5E9',
    flex: 1,
    position: 'relative',
  },
  resultSafeArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 10,
  },
  resultTitle: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 8,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    width: '100%',
  },
  scoreLabel: {
    color: colors.text.secondary,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  scoreValue: {
    color: colors.primary,
    fontSize: 48,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  starsContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  viewDetailButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    width: '100%',
  },
  viewDetailButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
