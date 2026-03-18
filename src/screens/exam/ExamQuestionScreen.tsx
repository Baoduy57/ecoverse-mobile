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
  container: { backgroundColor: colors.background, flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 220 },
  // Header
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 3,
    height: 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 40,
  },
  headerTitle: {
    color: ACCENT,
    fontSize: 18,
    fontWeight: '800',
  },
  timerBadge: {
    alignItems: 'center',
    backgroundColor: ACCENT_LIGHT,
    borderColor: ACCENT,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  timerBadgeLow: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  timerText: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '800',
  },
  timerTextLow: {
    color: '#EF4444',
  },
  // Progress
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  progressText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pointsBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderColor: colors.accent,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  pointsText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '800',
  },
  progressBar: {
    backgroundColor: '#E0E0E0',
    borderRadius: borderRadius.full,
    height: 8,
    marginBottom: spacing.md,
    marginHorizontal: spacing.base,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: ACCENT,
    borderRadius: borderRadius.full,
    height: '100%',
  },
  // Question
  questionCard: {
    backgroundColor: colors.surface,
    borderColor: ACCENT_LIGHT,
    borderRadius: 20,
    borderWidth: 2,
    elevation: 4,
    marginBottom: spacing.base,
    marginHorizontal: spacing.base,
    padding: spacing.base,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  questionText: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  questionSubtext: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  // Options
  optionsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  optionButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  optionButtonSelected: {
    backgroundColor: ACCENT_LIGHT,
    borderColor: ACCENT,
  },
  optionButtonCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.status.success,
  },
  optionButtonWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: colors.status.error,
  },
  optionIcon: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  optionIconSelected: { backgroundColor: '#BAE6FD' },
  optionIconCorrect: { backgroundColor: '#C8E6C9' },
  optionIconWrong: { backgroundColor: '#FFCDD2' },
  optionText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  optionTextSelected: { color: ACCENT },
  optionTextCorrect: { color: '#2E7D32' },
  optionTextWrong: { color: '#D32F2F' },
  // Next button
  nextButton: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 16,
    elevation: 4,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginHorizontal: spacing.base,
    paddingVertical: 14,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // Feedback
  feedbackContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    bottom: 0,
    elevation: 10,
    left: 0,
    padding: spacing.base,
    paddingBottom: 34,
    position: 'absolute',
    right: 0,
  },
  feedbackSuccess: { backgroundColor: '#F0FDF4' },
  feedbackError: { backgroundColor: '#FFF5F5' },
  feedbackContent: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  feedbackIconCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  feedbackTextContainer: { flex: 1 },
  feedbackTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  feedbackMessage: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
  },
  feedbackNextButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  feedbackNextButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
