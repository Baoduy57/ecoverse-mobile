import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../../theme';
import ScreenBackground from '../../common/ScreenBackground';

interface GamePlayResultProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  duration?: number;
  maxCombo?: number;
  completed?: boolean;
  onViewDetails: () => void;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function GamePlayResult({
  score,
  correctAnswers,
  totalQuestions,
  duration = 0,
  maxCombo = 0,
  completed = true,
  onViewDetails,
  onPlayAgain,
  onGoHome,
}: GamePlayResultProps) {
  const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
  const accuracyPercent = Math.round(accuracy * 100);
  const starCount = accuracy >= 0.8 ? 3 : accuracy >= 0.5 ? 2 : accuracy > 0 ? 1 : 0;

  const entranceAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(sparkleAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );

    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();

    sparkleLoop.start();

    return () => sparkleLoop.stop();
  }, [entranceAnim, sparkleAnim]);

  return (
    <View style={styles.resultContainer}>
      <ScreenBackground />
      <SafeAreaView style={styles.resultSafeArea}>
        <Animated.View
          style={[
            styles.celebrationWrap,
            {
              opacity: entranceAnim,
              transform: [
                {
                  translateY: entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.sparkleLeft,
              {
                opacity: sparkleAnim,
                transform: [
                  {
                    scale: sparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1.05],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons name="star-outline" size={20} color={colors.accent} />
          </Animated.View>

          <Animated.View
            style={[
              styles.sparkleRight,
              {
                opacity: sparkleAnim,
                transform: [
                  {
                    scale: sparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.1],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons name="star-four-points" size={18} color={colors.accent} />
          </Animated.View>

          <View style={styles.starsContainer}>
            <MaterialCommunityIcons
              name={starCount >= 1 ? 'star' : 'star-outline'}
              size={56}
              color={colors.accent}
            />
            <MaterialCommunityIcons
              name={starCount >= 2 ? 'star' : 'star-outline'}
              size={76}
              color={colors.accent}
            />
            <MaterialCommunityIcons
              name={starCount >= 3 ? 'star' : 'star-outline'}
              size={56}
              color={colors.accent}
            />
          </View>

          <Text style={styles.resultTitle}>NHIỆM VỤ HOÀN THÀNH!</Text>
          <Text style={styles.resultSubtitle}>Bạn vừa dọn sách các rác thải</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Tổng điểm</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
            <View
              style={[
                styles.completedChip,
                completed ? styles.completedChipOn : styles.completedChipOff,
              ]}
            >
              <Text style={styles.completedChipText}>
                {completed ? 'COMPLETED' : 'IN_PROGRESS'}
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={22}
                  color={colors.status.success}
                />
                <Text style={styles.statLabel}>Chính xác</Text>
                <Text style={styles.statValue}>
                  {correctAnswers}/{totalQuestions}
                </Text>
              </View>

              <View style={styles.statItem}>
                <MaterialCommunityIcons name="timer-outline" size={22} color={colors.primary} />
                <Text style={styles.statLabel}>Thời gian</Text>
                <Text style={styles.statValue}>{formatDuration(duration)}</Text>
              </View>

              <View style={styles.statItem}>
                <MaterialCommunityIcons name="lightning-bolt" size={22} color={colors.accent} />
                <Text style={styles.statLabel}>Combo cao nhất</Text>
                <Text style={styles.statValue}>{maxCombo}x</Text>
              </View>
            </View>

            <View style={styles.accuracyBarWrap}>
              <View style={styles.accuracyBarTrack}>
                <View style={[styles.accuracyBarFill, { width: `${accuracyPercent}%` }]} />
              </View>
              <Text style={styles.accuracyText}>Độ chính xác: {accuracyPercent}%</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.actionsWrap}>
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
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  accuracyBarFill: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    height: '100%',
  },
  accuracyBarTrack: {
    backgroundColor: '#E3F2E5',
    borderRadius: borderRadius.full,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  accuracyBarWrap: {
    marginTop: spacing.lg,
    width: '100%',
  },
  accuracyText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  actionsWrap: {
    width: '100%',
  },
  celebrationWrap: {
    alignItems: 'center',
    width: '100%',
  },
  completedChip: {
    borderRadius: borderRadius.full,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: 6,
  },
  completedChipOff: {
    backgroundColor: colors.text.disabled,
  },
  completedChipOn: {
    backgroundColor: colors.status.success,
  },
  completedChipText: {
    color: colors.text.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
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
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    zIndex: 10,
  },
  resultSubtitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  resultTitle: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 8,
    marginBottom: spacing.lg,
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
    fontSize: 44,
    fontWeight: '800',
    marginBottom: spacing.base,
  },
  sparkleLeft: {
    left: 44,
    position: 'absolute',
    top: 6,
  },
  sparkleRight: {
    position: 'absolute',
    right: 42,
    top: 8,
  },
  starsContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: spacing.sm,
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
