import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenBackground from '../../components/common/ScreenBackground';
import { QuizQuestionOptions } from '../../components/quiz';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import { quizApi } from '../../services/api';
import { borderRadius, colors, spacing } from '../../theme';
import { StudentQuizQuestion, StudentQuizTemplate } from '../../types/quiz';

type QuizQuestionRouteProp = RouteProp<AppStackParamList, 'QuizQuestion'>;

type AnswerMap = Record<string, string | null>;

const getOptionLetter = (index: number | null) => {
  if (index === null || index < 0) {
    return null;
  }
  return String.fromCharCode(65 + index);
};

const getSelectedIndex = (answers: AnswerMap, question: StudentQuizQuestion) => {
  const selected = answers[question.id];
  if (!selected) return null;
  const idx = question.options.indexOf(selected);
  return idx >= 0 ? idx : null;
};

export default function QuizQuestionScreen() {
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const route = useRoute<QuizQuestionRouteProp>();
  const templateId = route.params.templateId;

  const [quizDetail, setQuizDetail] = useState<StudentQuizTemplate | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<AnswerMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const startedAtRef = useRef<number>(Date.now());

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const loadDetail = async () => {
        setIsLoading(true);
        setErrorText(null);

        try {
          const detail = await quizApi.startQuiz(templateId);
          if (!isMounted) {
            return;
          }

          setQuizDetail(detail);
          startedAtRef.current = Date.now();
          setCurrentIndex(0);
          setAnswersByQuestionId({});
        } catch (error) {
          if (isMounted) {
            setErrorText('Khong the tai chi tiet quiz. Vui long thu lai.');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      loadDetail();

      return () => {
        isMounted = false;
      };
    }, [templateId])
  );

  const questions = useMemo(() => quizDetail?.questions ?? [], [quizDetail?.questions]);
  const currentQuestion = questions[currentIndex];
  const selectedIndex = currentQuestion
    ? getSelectedIndex(answersByQuestionId, currentQuestion)
    : null;

  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSelectOption = (index: number) => {
    if (!currentQuestion) {
      return;
    }

    const selectedOptionText = currentQuestion.options[index];
    setAnswersByQuestionId(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOptionText,
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!quizDetail || questions.length === 0) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const durationSeconds = Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000));
      const payloadAnswers = questions.map(question => ({
        question_id: question.id,
        selected_answer: answersByQuestionId[question.id] ?? null,
      }));

      const submitResult = await quizApi.submitQuiz({
        quiz_template_id: quizDetail.id,
        duration: durationSeconds,
        answers: payloadAnswers,
      });

      navigation.replace('QuizResult', {
        attempt: submitResult,
      });
    } catch (error) {
      Alert.alert('Submit that bai', 'Khong the nop bai luc nay. Vui long thu lai.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderScreen}>
        <ScreenBackground />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (errorText || !quizDetail || !currentQuestion) {
    return (
      <View style={styles.loaderScreen}>
        <ScreenBackground />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{errorText ?? 'Bài kiểm tra không có câu hỏi.'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.retryButtonText}>Quay lai</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {quizDetail.title}
            </Text>
            <Text style={styles.headerSubtitle}>Chọn đáp án cho từng câu hỏi</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Câu {currentIndex + 1}/{questions.length}
          </Text>
          <Text style={styles.progressText}>{Math.round(progressPercent)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionTitle}>Câu hỏi</Text>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>

          <QuizQuestionOptions
            options={currentQuestion.options}
            selectedIndex={selectedIndex}
            onSelect={handleSelectOption}
          />

          <View style={styles.actionRow}>
            {currentIndex > 0 ? (
              <TouchableOpacity style={styles.previousButton} onPress={handlePreviousQuestion}>
                <MaterialCommunityIcons name="arrow-left" size={18} color={colors.text.secondary} />
                <Text style={styles.previousButtonText}>Quay lại</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[styles.nextButton, isSubmitting && styles.nextButtonDisabled]}
              onPress={handleNextQuestion}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.text.white} />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>
                    {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Nộp bài'}
                  </Text>
                  <MaterialCommunityIcons name="arrow-right" size={18} color={colors.text.white} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorWrap: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  headerSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  loaderScreen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  nextButton: {
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
  nextButtonDisabled: {
    opacity: 0.6,
    elevation: 0,
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '900',
  },
  progressBar: {
    backgroundColor: '#E2E8F0',
    borderRadius: borderRadius.full,
    height: 12,
    marginHorizontal: spacing.base,
    overflow: 'hidden',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    height: '100%',
  },
  progressText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  questionText: {
    color: colors.text.primary,
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 28,
  },
  questionTitle: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF08A',
    borderRadius: borderRadius.md,
    color: '#CA8A04',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: 'uppercase',
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryButtonText: {
    color: colors.text.white,
    fontWeight: '700',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  previousButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    minWidth: 120,
    paddingHorizontal: spacing.md,
  },
  previousButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '800',
  },
});
