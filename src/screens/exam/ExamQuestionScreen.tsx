import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { QuizAnswer } from '../../types/quiz';
import { MOCK_EXAM_QUESTIONS, MOCK_SCHEDULED_EXAMS } from '../../data/examData';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';

type ExamQuestionRouteProp = RouteProp<AppStackParamList, 'ExamQuestion'>;

const ACCENT = '#0EA5E9';
const ACCENT_LIGHT = '#E0F2FE';
const ACCENT_DARK = '#0284C7';

export default function ExamQuestionScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<ExamQuestionRouteProp>();
  const examId = route.params?.examId ?? 'exam-2';

  const exam = MOCK_SCHEDULED_EXAMS.find(e => e.id === examId) ?? MOCK_SCHEDULED_EXAMS[0];
  const questions = MOCK_EXAM_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60); // seconds

  const currentQuestion = questions[currentIndex];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const submitExam = useCallback(
    (finalAnswers: QuizAnswer[], finalPoints: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const correctCount = finalAnswers.filter(a => a.isCorrect).length;
      const wrongCount = finalAnswers.length - correctCount;
      navigation.navigate('ExamResult', {
        examId,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        totalPoints: finalPoints,
        answers: finalAnswers,
      });
    },
    [examId, navigation, questions.length]
  );

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up — auto submit with whatever we have
          submitExam(answers, totalPoints);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [answers, totalPoints, submitExam]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isTimeLow = timeLeft <= 60;

  const handleSelectOption = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    const points = isCorrect ? currentQuestion.points : 0;

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      isCorrect,
      timeSpent: 0,
    };
    const newAnswers = [...answers, answer];
    const newPoints = totalPoints + points;

    setAnswers(newAnswers);
    setTotalPoints(newPoints);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        submitExam(newAnswers, newPoints);
      }
    }, 1200);
  };

  const isCorrectOption = (optionId: string) =>
    showFeedback && optionId === currentQuestion.correctOptionId;

  const isWrongOption = (optionId: string) =>
    showFeedback &&
    optionId === selectedOption &&
    selectedOption !== currentQuestion.correctOptionId;

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kiểm tra định kỳ</Text>
          {/* Timer */}
          <View style={[styles.timerBadge, isTimeLow && styles.timerBadgeLow]}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={16}
              color={isTimeLow ? '#EF4444' : ACCENT}
            />
            <Text style={[styles.timerText, isTimeLow && styles.timerTextLow]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            CÂU {currentIndex + 1}/{questions.length}
          </Text>
          <View style={styles.pointsBadge}>
            <MaterialCommunityIcons name="star" size={16} color={colors.accent} />
            <Text style={styles.pointsText}>{totalPoints}</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Card */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <Text style={styles.questionSubtext}>Chọn đáp án đúng bên dưới.</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map(option => (
              <TouchableOpacity
                key={`${currentQuestion.id}-${option.id}`}
                style={[
                  styles.optionButton,
                  selectedOption === option.id && !showFeedback && styles.optionButtonSelected,
                  isCorrectOption(option.id) && styles.optionButtonCorrect,
                  isWrongOption(option.id) && styles.optionButtonWrong,
                ]}
                onPress={() => handleSelectOption(option.id)}
                disabled={showFeedback}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.optionIcon,
                    selectedOption === option.id && !showFeedback && styles.optionIconSelected,
                    isCorrectOption(option.id) && styles.optionIconCorrect,
                    isWrongOption(option.id) && styles.optionIconWrong,
                  ]}
                >
                  {option.icon && (
                    <MaterialCommunityIcons
                      name={option.icon as any}
                      size={24}
                      color={
                        isCorrectOption(option.id)
                          ? colors.status.success
                          : isWrongOption(option.id)
                            ? colors.status.error
                            : selectedOption === option.id
                              ? ACCENT
                              : colors.text.secondary
                      }
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option.id && !showFeedback && styles.optionTextSelected,
                    isCorrectOption(option.id) && styles.optionTextCorrect,
                    isWrongOption(option.id) && styles.optionTextWrong,
                  ]}
                >
                  {option.text}
                </Text>
                {isCorrectOption(option.id) && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={colors.status.success}
                  />
                )}
                {isWrongOption(option.id) && (
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={24}
                    color={colors.status.error}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Next button (before feedback) */}
          {selectedOption && !showFeedback && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>CÂU TIẾP THEO</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color={colors.text.white} />
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Feedback bar */}
        {showFeedback && (
          <View
            style={[
              styles.feedbackContainer,
              selectedOption === currentQuestion.correctOptionId
                ? styles.feedbackSuccess
                : styles.feedbackError,
            ]}
          >
            <View style={styles.feedbackContent}>
              <View style={styles.feedbackIconCircle}>
                <MaterialCommunityIcons
                  name={
                    selectedOption === currentQuestion.correctOptionId
                      ? 'check-circle'
                      : 'close-circle'
                  }
                  size={28}
                  color={selectedOption === currentQuestion.correctOptionId ? '#2E7D32' : '#D32F2F'}
                />
              </View>
              <View style={styles.feedbackTextContainer}>
                <Text style={styles.feedbackTitle}>
                  {selectedOption === currentQuestion.correctOptionId ? 'Chính xác!' : 'Sai rồi!'}
                </Text>
                <Text style={styles.feedbackMessage} numberOfLines={2}>
                  {currentQuestion.explanation ?? 'Hãy ghi nhớ để lần sau không bị sai nhé!'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.feedbackNextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.feedbackNextButtonText}>
                {currentIndex < questions.length - 1 ? 'CÂU TIẾP THEO' : 'NỘP BÀI'}
              </Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 220 },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ACCENT,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ACCENT_LIGHT,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: ACCENT,
  },
  timerBadgeLow: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  timerText: {
    fontSize: 15,
    fontWeight: '800',
    color: ACCENT,
  },
  timerTextLow: {
    color: '#EF4444',
  },
  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    marginHorizontal: spacing.base,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: borderRadius.full,
  },
  // Question
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 2,
    borderColor: ACCENT_LIGHT,
    elevation: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 28,
  },
  questionSubtext: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  // Options
  optionsContainer: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    gap: spacing.sm,
  },
  optionButtonSelected: {
    borderColor: ACCENT,
    backgroundColor: ACCENT_LIGHT,
  },
  optionButtonCorrect: {
    borderColor: colors.status.success,
    backgroundColor: '#E8F5E9',
  },
  optionButtonWrong: {
    borderColor: colors.status.error,
    backgroundColor: '#FFEBEE',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconSelected: { backgroundColor: '#BAE6FD' },
  optionIconCorrect: { backgroundColor: '#C8E6C9' },
  optionIconWrong: { backgroundColor: '#FFCDD2' },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  optionTextSelected: { color: ACCENT },
  optionTextCorrect: { color: '#2E7D32' },
  optionTextWrong: { color: '#D32F2F' },
  // Next button
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 14,
    marginHorizontal: spacing.base,
    gap: spacing.sm,
    elevation: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.white,
    letterSpacing: 0.5,
  },
  // Feedback
  feedbackContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.base,
    paddingBottom: 34,
    elevation: 10,
  },
  feedbackSuccess: { backgroundColor: '#F0FDF4' },
  feedbackError: { backgroundColor: '#FFF5F5' },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  feedbackIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackTextContainer: { flex: 1 },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 4,
  },
  feedbackMessage: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  feedbackNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 12,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  feedbackNextButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
});
