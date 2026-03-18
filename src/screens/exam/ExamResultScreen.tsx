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
  answerContent: { flex: 1, gap: 2 },
  answerCorrect: {
    color: colors.status.success,
    fontSize: 12,
    fontWeight: '600',
  },
  answerIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  answerIconCorrect: { backgroundColor: colors.status.success },
  answerIconError: { backgroundColor: colors.status.error },
  answerItem: {
    alignItems: 'center',
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  answerQuestion: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 2,
    marginBottom: spacing.xl,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  breakdownHeader: {
    alignItems: 'center',
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
  },
  breakdownTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  container: { backgroundColor: colors.background, flex: 1 },
  examInfoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  examInfoText: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '600',
  },
  gradeLabel: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'center',
  },
  pointsCard: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderColor: '#0284C7',
    borderRadius: 24,
    borderWidth: 3,
    elevation: 6,
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  pointsLabel: {
    color: colors.text.white,
    fontSize: 32,
    fontWeight: '900',
  },
  pointsSubLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 16,
    elevation: 4,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingVertical: 14,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '800',
  },
  safeArea: { flex: 1 },
  scrollContent: { padding: spacing.base },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  starsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 3,
    elevation: 4,
    flex: 1,
    paddingVertical: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statItemError: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF6B6B',
  },
  statItemSuccess: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  statValueError: { color: '#D32F2F' },
  statValueSuccess: { color: '#2E7D32' },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  subTitle: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
