import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { QuizQuestion, QuizAnswer } from '../../types/quiz';
import { MOCK_QUIZ_QUESTIONS } from '../../data/quizData';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';

type QuizQuestionScreenRouteProp = RouteProp<AppStackParamList, 'QuizQuestion'>;

export default function QuizQuestionScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<QuizQuestionScreenRouteProp>();
  const quizId = route.params?.quizId || '1';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const delayRef = useRef<NodeJS.Timeout | null>(null);
  const advanceRef = useRef<(() => void) | null>(null);
  const isAnsweringRef = useRef(false);

  useEffect(() => {
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  const currentQuestion = MOCK_QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;
    if (isAnsweringRef.current) return;
    isAnsweringRef.current = true;

    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    const points = isCorrect ? currentQuestion.points : 0;

    // Save answer
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

    // Show feedback
    setShowFeedback(true);

    const advance = () => {
      isAnsweringRef.current = false;
      if (currentQuestionIndex < MOCK_QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // Navigate to results
        const correctCount = newAnswers.filter(a => a.isCorrect).length;
        const wrongCount = newAnswers.length - correctCount;

        navigation.navigate('QuizResult', {
          quizId,
          totalQuestions: MOCK_QUIZ_QUESTIONS.length,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          totalPoints: newPoints,
          answers: newAnswers,
        });
      }
    };

    // Move to next question or show results automatically
    delayRef.current = setTimeout(advance, 1500);
    advanceRef.current = advance;
  };

  const handleNextFromFeedback = () => {
    if (delayRef.current) clearTimeout(delayRef.current);
    if (advanceRef.current) {
      advanceRef.current();
      advanceRef.current = null;
    }
  };

  const isCorrectOption = (optionId: string) => {
    return showFeedback && optionId === currentQuestion.correctOptionId;
  };

  const isWrongOption = (optionId: string) => {
    return (
      showFeedback &&
      optionId === selectedOption &&
      selectedOption !== currentQuestion.correctOptionId
    );
  };

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz Time</Text>
          <View style={styles.closeButton} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            QUESTION {currentQuestionIndex + 1}/{MOCK_QUIZ_QUESTIONS.length}
          </Text>
          <View style={styles.coinBadge}>
            <MaterialCommunityIcons name="star" size={16} color={colors.accent} />
            <Text style={styles.coinText}>{totalPoints}</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / MOCK_QUIZ_QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Card */}
          <View style={styles.questionCard}>
            {/* Image if available */}
            {currentQuestion.imageUrl && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: currentQuestion.imageUrl }}
                  style={styles.questionImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Question Text */}
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <Text style={styles.questionSubtext}>Select the correct bin below.</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
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
                              ? colors.primary
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

          {/* Next Button when option selected but no feedback yet */}
          {selectedOption && !showFeedback && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>NEXT QUESTION</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color={colors.text.white} />
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Feedback Message - Bottom notification like in image */}
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
                  {selectedOption === currentQuestion.correctOptionId ? 'Awesome Job!' : 'Oops!'}
                </Text>
                <Text style={styles.feedbackMessage}>
                  {selectedOption === currentQuestion.correctOptionId
                    ? currentQuestion.explanation ||
                      'Aluminum cans can be recycled forever into new cans!'
                    : currentQuestion.explanation || 'Try again next time!'}
                </Text>
              </View>
            </View>

            {/* Next Button inside feedback */}
            <TouchableOpacity
              style={styles.feedbackNextButton}
              onPress={handleNextFromFeedback}
              activeOpacity={0.8}
            >
              <Text style={styles.feedbackNextButtonText}>NEXT QUESTION</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  coinBadge: {
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
  coinText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '800',
  },
  container: {
    backgroundColor: '#F0F9FF',
    flex: 1,
  },
  feedbackContainer: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    bottom: 0,
    elevation: 10,
    left: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  feedbackContent: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  feedbackError: {
    backgroundColor: colors.status.error,
  },
  feedbackIconCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    borderWidth: 3,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  feedbackMessage: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    opacity: 0.95,
  },
  feedbackNextButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.full,
    elevation: 5,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  feedbackNextButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  feedbackSuccess: {
    backgroundColor: colors.status.success,
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackTitle: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  imageContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.lg,
    height: 200,
    marginBottom: spacing.md,
    overflow: 'hidden',
    width: '100%',
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    elevation: 5,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginHorizontal: spacing.base,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
  optionButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    borderWidth: 3,
    elevation: 3,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  optionButtonCorrect: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
    transform: [{ scale: 1.02 }],
  },
  optionButtonWrong: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    borderColor: '#F44336',
    shadowColor: '#F44336',
    shadowOpacity: 0.3,
  },
  optionIcon: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderColor: 'transparent',
    borderRadius: 28,
    borderWidth: 2,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  optionIconCorrect: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  optionIconSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  optionIconWrong: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
  },
  optionText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  optionTextCorrect: {
    color: colors.status.success,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  optionTextWrong: {
    color: colors.status.error,
  },
  optionsContainer: {
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  progressBar: {
    backgroundColor: '#E0E0E0',
    borderRadius: borderRadius.full,
    height: 8,
    marginHorizontal: spacing.base,
    overflow: 'hidden',
  },
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  progressFill: {
    backgroundColor: '#4CAF50',
    borderRadius: borderRadius.full,
    height: '100%',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  progressText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 24,
    borderWidth: 2,
    elevation: 8,
    margin: spacing.base,
    marginTop: spacing.lg,
    padding: spacing.xl,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  questionImage: {
    height: '100%',
    width: '100%',
  },
  questionSubtext: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  questionText: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 220,
  },
  scrollView: {
    flex: 1,
  },
});
