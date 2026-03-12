import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { MOCK_EXAM_QUESTIONS, MOCK_SCHEDULED_EXAMS } from '../../data/examData';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';

type ExamResultRouteProp = RouteProp<AppStackParamList, 'ExamResult'>;

const ACCENT = '#0EA5E9';
const ACCENT_LIGHT = '#E0F2FE';

export default function ExamResultScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<ExamResultRouteProp>();
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  const {
    examId,
    totalQuestions = 15,
    correctAnswers = 0,
    wrongAnswers = 0,
    totalPoints = 0,
    answers = [],
  } = route.params ?? {};

  const exam = MOCK_SCHEDULED_EXAMS.find(e => e.id === examId) ?? MOCK_SCHEDULED_EXAMS[0];
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Xuất sắc!', color: '#10B981' };
    if (percentage >= 70) return { label: 'Khá tốt!', color: ACCENT };
    if (percentage >= 50) return { label: 'Trung bình', color: '#F59E0B' };
    return { label: 'Cần cố gắng thêm', color: '#EF4444' };
  };

  const grade = getGrade();

  const answerDetails = answers.map((answer, index) => {
    const question = MOCK_EXAM_QUESTIONS.find(q => q.id === answer.questionId);
    const selectedOption = question?.options.find(opt => opt.id === answer.selectedOptionId);
    const correctOption = question?.options.find(opt => opt.id === question.correctOptionId);
    return {
      id: answer.questionId,
      question: question?.question ?? `Câu ${index + 1}`,
      userAnswer: selectedOption?.text ?? '',
      correctAnswer: correctOption?.text ?? '',
      isCorrect: answer.isCorrect,
      explanation: question?.explanation,
    };
  });

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stars */}
          <View style={styles.starsContainer}>
            {[1, 2, 3].map(starIndex => (
              <MaterialCommunityIcons
                key={`star-${starIndex}`}
                name="star"
                size={starIndex === 2 ? 100 : 80}
                color={starIndex <= stars ? colors.accent : '#E0E0E0'}
              />
            ))}
          </View>

          {/* Title */}
          <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
          <Text style={styles.subTitle}>Bài kiểm tra đã được nộp</Text>

          {/* Exam info */}
          <View style={styles.examInfoRow}>
            <MaterialCommunityIcons name="school" size={14} color={ACCENT} />
            <Text style={styles.examInfoText} numberOfLines={1}>
              {exam.title}
            </Text>
          </View>

          {/* Points card */}
          <View style={styles.pointsCard}>
            <Text style={styles.pointsLabel}>+{totalPoints} Điểm</Text>
            <Text style={styles.pointsSubLabel}>{Math.round(percentage)}% chính xác</Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalQuestions}</Text>
              <Text style={styles.statLabel}>TỔNG SỐ</Text>
            </View>
            <View style={[styles.statItem, styles.statItemSuccess]}>
              <Text style={[styles.statValue, styles.statValueSuccess]}>{correctAnswers}</Text>
              <Text style={styles.statLabel}>ĐÚNG</Text>
            </View>
            <View style={[styles.statItem, styles.statItemError]}>
              <Text style={[styles.statValue, styles.statValueError]}>{wrongAnswers}</Text>
              <Text style={styles.statLabel}>SAI</Text>
            </View>
          </View>

          {/* Answer breakdown */}
          <View style={styles.breakdownContainer}>
            <TouchableOpacity
              style={styles.breakdownHeader}
              onPress={() => setShowBreakdown(v => !v)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="format-list-checks" size={20} color={ACCENT} />
              <Text style={[styles.breakdownTitle, { flex: 1 }]}>Xem lại kết quả</Text>
              <MaterialCommunityIcons
                name={showBreakdown ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={colors.text.secondary}
              />
            </TouchableOpacity>

            {showBreakdown &&
              answerDetails.map((detail, index) => (
                <View key={`${detail.id}-${index}`} style={styles.answerItem}>
                  <View
                    style={[
                      styles.answerIcon,
                      detail.isCorrect ? styles.answerIconCorrect : styles.answerIconError,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={detail.isCorrect ? 'check' : 'close'}
                      size={18}
                      color={colors.text.white}
                    />
                  </View>
                  <View style={styles.answerContent}>
                    <Text style={styles.answerQuestion} numberOfLines={1}>
                      {detail.question}
                    </Text>
                    {!detail.isCorrect && (
                      <Text style={styles.answerCorrect} numberOfLines={1}>
                        ✓ {detail.correctAnswer}
                      </Text>
                    )}
                  </View>
                  <MaterialCommunityIcons
                    name={detail.isCorrect ? 'check-circle' : 'close-circle'}
                    size={22}
                    color={detail.isCorrect ? colors.status.success : colors.status.error}
                  />
                </View>
              ))}
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('ScheduledExam')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="calendar-check" size={22} color={colors.text.white} />
            <Text style={styles.primaryButtonText}>Về danh sách kiểm tra</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Home' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="home" size={22} color={colors.text.primary} />
            <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safeArea: { flex: 1 },
  scrollContent: { padding: spacing.base },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  gradeLabel: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  examInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  examInfoText: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: '600',
  },
  pointsCard: {
    backgroundColor: ACCENT,
    borderRadius: 24,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#0284C7',
  },
  pointsLabel: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text.white,
  },
  pointsSubLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statItemSuccess: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  statItemError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFEBEE',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statValueSuccess: { color: '#2E7D32' },
  statValueError: { color: '#D32F2F' },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  breakdownContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.base,
    marginBottom: spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.primary,
  },
  answerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  answerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerIconCorrect: { backgroundColor: colors.status.success },
  answerIconError: { backgroundColor: colors.status.error },
  answerContent: { flex: 1, gap: 2 },
  answerQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  answerCorrect: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: spacing.md,
    gap: spacing.sm,
    elevation: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
});
