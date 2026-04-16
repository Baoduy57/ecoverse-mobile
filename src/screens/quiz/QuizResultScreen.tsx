import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenBackground from '../../components/common/ScreenBackground';
import { QuizPlacementsList } from '../../components/quiz';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import { borderRadius, colors, spacing } from '../../theme';

type QuizResultRouteProp = RouteProp<AppStackParamList, 'QuizResult'>;

export default function QuizResultScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<QuizResultRouteProp>();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { attempt } = route.params;

  const accuracy = useMemo(() => {
    if (attempt.total_questions <= 0) {
      return 0;
    }
    return Math.round((attempt.correct_amount / attempt.total_questions) * 100);
  }, [attempt.correct_amount, attempt.total_questions]);

  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 40 ? 1 : 0;
  const isPerfect = accuracy === 100;

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.starsRow}>
            {[1, 2, 3].map(index => {
              const isActive = index <= stars;
              const isCenter = index === 2;
              return (
                <View
                  key={`star-${index}`}
                  style={[
                    styles.starIconWrapper,
                    isCenter && styles.starIconCenter,
                    !isActive && styles.starIconInactive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="star"
                    size={isCenter ? 68 : 54}
                    color={isActive ? colors.game.star : '#CBD5E1'}
                  />
                </View>
              );
            })}
          </View>

          <Text style={styles.title}>{isPerfect ? 'Xuất sắc!' : 'Hoàn thành!'}</Text>
          <Text style={styles.quizTitle} numberOfLines={2}>
            {attempt.quiz_title}
          </Text>

          {/* Main Score Card */}
          <View style={styles.scoreCardWrapper}>
            <LinearGradient
              colors={accuracy >= 70 ? colors.gradient.primary : ['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scoreCard}
            >
              <View style={styles.glowBubbleLarge} />
              <View style={styles.glowBubbleSmall} />

              <View style={styles.scoreLabelWrap}>
                <Text style={styles.scoreLabel}>ĐIỂM SỐ</Text>
              </View>
              <Text style={styles.scoreValue}>{attempt.score}%</Text>
              <Text style={styles.scoreSubtitle}>
                Chính xác {attempt.correct_amount}/{attempt.total_questions}
              </Text>
            </LinearGradient>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }]}>
              <View style={[styles.statIconBox, { backgroundColor: '#DCFCE7' }]}>
                <MaterialCommunityIcons name="check-bold" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.statValue, { color: '#16A34A' }]}>{attempt.correct_amount}</Text>
              <Text style={styles.statLabel}>Đúng</Text>
            </View>

            <View style={[styles.statCard, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}>
              <View style={[styles.statIconBox, { backgroundColor: '#FEE2E2' }]}>
                <MaterialCommunityIcons name="close-thick" size={20} color="#DC2626" />
              </View>
              <Text style={[styles.statValue, { color: '#DC2626' }]}>{attempt.wrong_amount}</Text>
              <Text style={styles.statLabel}>Sai</Text>
            </View>

            <View style={[styles.statCard, { borderColor: '#BAE6FD', backgroundColor: '#F0F9FF' }]}>
              <View style={[styles.statIconBox, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="timer-outline" size={20} color="#0284C7" />
              </View>
              <Text style={[styles.statValue, { color: '#0284C7' }]}>{attempt.duration}s</Text>
              <Text style={styles.statLabel}>Thời gian</Text>
            </View>
          </View>

          {/* Breakdown Toggle */}
          <TouchableOpacity
            style={styles.breakdownToggle}
            onPress={() => setShowBreakdown(v => !v)}
            activeOpacity={0.8}
          >
            <View style={styles.breakdownIconWrap}>
              <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.primary} />
            </View>
            <Text style={styles.breakdownToggleText}>Xem chi tiết đáp án</Text>
            <MaterialCommunityIcons
              name={showBreakdown ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          {showBreakdown ? <QuizPlacementsList placements={attempt.placements} /> : null}

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Home' as never)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="home" size={20} color={colors.text.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('QuizList')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="refresh" size={20} color={colors.text.white} />
              <Text style={styles.primaryButtonText}>Làm bài khác</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingTop: spacing.lg,
  },
  starsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  starIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF08A',
    transform: [{ translateY: 10 }],
    elevation: 2,
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  starIconCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    transform: [{ translateY: -10 }],
  },
  starIconInactive: {
    backgroundColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  title: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  quizTitle: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xl,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  scoreCardWrapper: {
    marginBottom: spacing.xl,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderRadius: 24,
  },
  scoreCard: {
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  glowBubbleLarge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 100,
    height: 180,
    position: 'absolute',
    right: -40,
    top: -50,
    width: 180,
  },
  glowBubbleSmall: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 60,
    bottom: -20,
    left: -20,
    height: 100,
    width: 100,
    position: 'absolute',
  },
  scoreLabelWrap: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreValue: {
    color: colors.text.white,
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 64,
  },
  scoreSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  statIconBox: {
    padding: 8,
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  breakdownToggle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  breakdownIconWrap: {
    backgroundColor: '#DCFCE7',
    padding: 6,
    borderRadius: 8,
  },
  breakdownToggleText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: 14,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  primaryButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
});
