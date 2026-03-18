import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { MOCK_QUIZ_QUESTIONS } from '../../data/quizData';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';

type QuizResultScreenRouteProp = RouteProp<AppStackParamList, 'QuizResult'>;

export default function QuizResultScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  const {
    quizId,
    totalQuestions = 10,
    correctAnswers = 0,
    wrongAnswers = 0,
    totalPoints = 0,
    answers = [],
  } = route.params || {};

  const percentage = (correctAnswers / totalQuestions) * 100;
  const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Xuất sắc!', color: '#10B981' };
    if (percentage >= 70) return { label: 'Khá tốt!', color: colors.primary };
    if (percentage >= 50) return { label: 'Trung bình', color: '#F59E0B' };
    return { label: 'Cần cố gắng thêm', color: '#EF4444' };
  };

  const grade = getGrade();

  const answerDetails = answers.map((answer, index) => {
    const question = MOCK_QUIZ_QUESTIONS.find(q => q.id === answer.questionId);
    const selectedOption = question?.options.find(opt => opt.id === answer.selectedOptionId);
    const correctOption = question?.options.find(opt => opt.id === question.correctOptionId);

    return {
      id: answer.questionId,
      question: question?.question || `Câu ${index + 1}`,
      userAnswer: selectedOption?.text || '',
      correctAnswer: correctOption?.text || '',
      isCorrect: answer.isCorrect,
      explanation: question?.explanation,
    };
  });

  const handleViewDetails = () => {
    navigation.navigate('QuizAnswerDetail', { answerDetails });
  };

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
          <Text style={styles.subTitle}>Bài quiz đã hoàn thành</Text>

          {/* Points Card */}
          <View style={styles.pointsCard}>
            <Text style={styles.pointsLabel}>+{totalPoints} Điểm</Text>
            <Text style={styles.pointsSubLabel}>{Math.round(percentage)}% chính xác</Text>
          </View>

          {/* Stats */}
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

          {/* Answer Breakdown */}
          <View style={styles.breakdownContainer}>
            <TouchableOpacity
              style={styles.breakdownHeader}
              onPress={() => setShowBreakdown(v => !v)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="format-list-checks" size={20} color={colors.primary} />
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
                      size={20}
                      color={colors.text.white}
                    />
                  </View>
                  <View style={styles.answerContent}>
                    <Text style={styles.answerQuestion} numberOfLines={1}>
                      {detail.question}
                    </Text>
                    <Text style={styles.answerText} numberOfLines={1}>
                      {detail.isCorrect ? 'Câu trả lời đúng' : detail.correctAnswer}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={detail.isCorrect ? 'check-circle' : 'close-circle'}
                    size={24}
                    color={detail.isCorrect ? colors.status.success : colors.status.error}
                  />
                </View>
              ))}
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('QuizList')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="refresh" size={24} color={colors.text.white} />
            <Text style={styles.primaryButtonText}>Chơi lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Home' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="home" size={24} color={colors.text.primary} />
            <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
          </TouchableOpacity>

          {/* Bottom padding */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  answerContent: {
    flex: 1,
  },
  answerIcon: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  answerIconCorrect: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  answerIconError: {
    backgroundColor: '#FF6B6B',
    borderColor: '#D32F2F',
  },
  answerItem: {
    alignItems: 'center',
    borderBottomColor: '#F5F5F5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  answerQuestion: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  answerText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  breakdownContainer: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 3,
    marginBottom: spacing.lg,
    padding: spacing.base,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  breakdownHeader: {
    alignItems: 'center',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
  },
  breakdownTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  gradeLabel: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'center',
  },
  pointsCard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: '#2E7D32',
    borderRadius: 24,
    borderWidth: 3,
    elevation: 6,
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
    shadowColor: colors.primary,
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
    backgroundColor: colors.primary,
    borderRadius: 16,
    elevation: 4,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingVertical: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '800',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
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
    marginBottom: spacing.lg,
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
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  statValueError: {
    color: '#D32F2F',
  },
  statValueSuccess: {
    color: '#2E7D32',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  subTitle: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});
