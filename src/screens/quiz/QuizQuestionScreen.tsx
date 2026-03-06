import React, { useState, useEffect } from 'react';
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

  const currentQuestion = MOCK_QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    const points = isCorrect ? currentQuestion.points : 0;

    // Save answer
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      isCorrect,
      timeSpent: 0,
    };
    setAnswers([...answers, answer]);
    setTotalPoints(totalPoints + points);

    // Show feedback
    setShowFeedback(true);

    // Move to next question or show results
    setTimeout(() => {
      if (currentQuestionIndex < MOCK_QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // Navigate to results
        const finalAnswers = [...answers, answer];
        const correctCount = finalAnswers.filter(a => a.isCorrect).length;
        const wrongCount = finalAnswers.length - correctCount;

        navigation.navigate('QuizResult', {
          quizId,
          totalQuestions: MOCK_QUIZ_QUESTIONS.length,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          totalPoints: totalPoints + points,
          answers: finalAnswers,
        });
      }
    }, 1500);
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
              onPress={handleNextQuestion}
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
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 220,
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
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
  coinBadge: {
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
  coinText: {
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
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: borderRadius.full,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  questionCard: {
    margin: spacing.base,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: '#F5F5F5',
  },
  questionImage: {
    width: '100%',
    height: '100%',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    lineHeight: 30,
  },
  questionSubtext: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  optionsContainer: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  optionButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
    transform: [{ scale: 1.02 }],
  },
  optionButtonCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
  },
  optionButtonWrong: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    shadowColor: '#F44336',
    shadowOpacity: 0.3,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIconSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  optionIconCorrect: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  optionIconWrong: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  optionTextCorrect: {
    color: colors.status.success,
  },
  optionTextWrong: {
    color: colors.status.error,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  feedbackSuccess: {
    backgroundColor: colors.status.success,
  },
  feedbackError: {
    backgroundColor: colors.status.error,
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  feedbackIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.white,
    marginBottom: spacing.xs,
  },
  feedbackMessage: {
    fontSize: 14,
    color: colors.text.white,
    opacity: 0.95,
    lineHeight: 20,
    fontWeight: '500',
  },
  feedbackNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  feedbackNextButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    marginHorizontal: spacing.base,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
  },
});
