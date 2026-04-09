import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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

  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.starsRow}>
            {[1, 2, 3].map(index => (
              <MaterialCommunityIcons
                key={`star-${index}`}
                name="star"
                size={index === 2 ? 92 : 74}
                color={index <= stars ? colors.accent : '#E2E8F0'}
              />
            ))}
          </View>

          <Text style={styles.title}>Đã hoàn thành bài kiểm tra</Text>
          <Text style={styles.quizTitle}>{attempt.quiz_title}</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{attempt.score}%</Text>
            <Text style={styles.scoreSubtitle}>
              {attempt.correct_amount}/{attempt.total_questions} Câu đúng
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{attempt.correct_amount}</Text>
              <Text style={styles.statLabel}>Đúng</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{attempt.wrong_amount}</Text>
              <Text style={styles.statLabel}>Sai</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{attempt.duration}s</Text>
              <Text style={styles.statLabel}>Thời gian</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.breakdownToggle}
            onPress={() => setShowBreakdown(v => !v)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.primary} />
            <Text style={styles.breakdownToggleText}>Chi tiết đáp án</Text>
            <MaterialCommunityIcons
              name={showBreakdown ? 'chevron-up' : 'chevron-down'}
              size={22}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          {showBreakdown ? <QuizPlacementsList placements={attempt.placements} /> : null}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('QuizList')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="refresh" size={20} color={colors.text.white} />
            <Text style={styles.primaryButtonText}>Làm bài kiểm tra khác</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Home' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="home" size={20} color={colors.text.primary} />
            <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
          </TouchableOpacity>

          <View style={{ height: 28 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  breakdownToggle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  breakdownToggleText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryButtonText: {
    color: colors.text.white,
    fontSize: 15,
    fontWeight: '800',
  },
  quizTitle: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
  },
  scoreSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  scoreValue: {
    color: colors.text.white,
    fontSize: 38,
    fontWeight: '900',
  },
  scrollContent: {
    padding: spacing.base,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  starsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.md,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
});
