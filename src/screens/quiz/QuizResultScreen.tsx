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
          <Text style={styles.title}>Tuyệt vời!</Text>

          {/* Points Card */}
          <View style={styles.pointsCard}>
            <Text style={styles.pointsLabel}>+{totalPoints} Điểm</Text>
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
            <View style={styles.breakdownHeader}>
              <MaterialCommunityIcons name="format-list-checks" size={20} color={colors.primary} />
              <Text style={styles.breakdownTitle}>Xem lại kết quả</Text>
            </View>

            {answerDetails.map((detail, index) => (
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
            onPress={() => navigation.goBack()}
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
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  pointsCard: {
    backgroundColor: '#FFD54F',
    borderRadius: 24,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    shadowColor: '#FFD54F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFC107',
  },
  pointsLabel: {
    fontSize: 32,
    fontWeight: '900',
    color: '#D84315',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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
  statValueSuccess: {
    color: '#2E7D32',
  },
  statValueError: {
    color: '#D32F2F',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  breakdownContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.base,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.1)',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
  },
  answerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  answerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  answerIconCorrect: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  answerIconError: {
    backgroundColor: '#FF6B6B',
    borderColor: '#D32F2F',
  },
  answerContent: {
    flex: 1,
  },
  answerQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  answerText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#4CAF50',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4CAF50',
  },
});
