import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { quizApi } from '../../services/api/quiz';
import { competitionApi } from '../../services/api/competition';
import { useAuthStore } from '../../store/authStore';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import type { StudentQuizQuestion, StudentQuizSubmitPayloadAnswer } from '../../types/quiz';
import ScreenBackground from '../../components/common/ScreenBackground';

type ExamQuestionRouteProp = RouteProp<AppStackParamList, 'ExamQuestion'>;

const ACCENT = '#F59E0B';
const ACCENT_LIGHT = '#FEF3C7';

export default function ExamQuestionScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<ExamQuestionRouteProp>();
  const { user } = useAuthStore();

  const competitionId = route.params?.competitionId;
  const quizTemplateId = route.params?.quizTemplateId || route.params?.examId || '';
  const competitionScore = route.params?.competitionScore;

  // Data states
  const [questions, setQuestions] = useState<StudentQuizQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState('Cuộc thi');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Quiz progress states
  const [currentIndex, setCurrentIndex] = useState(0);
  // selections: map from questionId -> selected option text (for UI display)
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const selectedOption = currentQuestion ? selections[currentQuestion.id] || null : null;

  // Load quiz data from API
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const template = await quizApi.startQuiz(quizTemplateId);
        setQuizTitle(template.title || 'Cuộc thi');
        if (template.questions && template.questions.length > 0) {
          setQuestions(template.questions);
          const autoTime = template.questions.length * 60;
          setTimeLeft(autoTime);
          startTimeRef.current = Date.now();
        } else {
          setLoadError('Bài kiểm tra này chưa có câu hỏi.');
        }
      } catch (err: any) {
        console.error('Error loading quiz for competition:', err);
        setLoadError('Không thể tải câu hỏi. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [quizTemplateId]);

  // Detect BE answer format: letter ("A") or full text ("Rác tái chế")
  const resolveAnswer = useCallback((q: StudentQuizQuestion, sel: string) => {
    const idx = q.options.indexOf(sel);
    if (idx < 0) return '';
    const letter = String.fromCharCode(65 + idx);
    // If BE correct_answer is a single letter (A-D), submit letter
    if (q.correct_answer && /^[A-Da-d]$/.test(q.correct_answer)) {
      return letter;
    }
    // Otherwise BE uses full text, submit full option text
    return sel;
  }, []);

  const isAnswerCorrect = useCallback((q: StudentQuizQuestion, sel: string) => {
    const idx = q.options.indexOf(sel);
    if (idx < 0) return false;
    const letter = String.fromCharCode(65 + idx);
    const ca = q.correct_answer;
    if (!ca) return false;
    // Match letter format
    if (/^[A-Da-d]$/.test(ca)) return letter.toUpperCase() === ca.toUpperCase();
    // Match full text
    return sel === ca;
  }, []);

  // Build answers from selections map
  const buildAnswers = useCallback(() => {
    return questions.map(q => {
      const sel = selections[q.id];
      if (!sel) return null;
      return {
        question_id: q.id,
        selected_answer: resolveAnswer(q, sel),
      } as StudentQuizSubmitPayloadAnswer;
    }).filter((a): a is StudentQuizSubmitPayloadAnswer => a !== null && a.selected_answer !== '');
  }, [questions, selections, resolveAnswer]);

  const countCorrect = useCallback(() => {
    let count = 0;
    for (const q of questions) {
      const sel = selections[q.id];
      if (!sel) continue;
      if (isAnswerCorrect(q, sel)) count++;
    }
    return count;
  }, [questions, selections, isAnswerCorrect]);

  // Submit function
  const submitExam = useCallback(
    async () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (isSubmitting) return;
      setIsSubmitting(true);

      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const finalAnswers = buildAnswers();
      const finalCorrectCount = countCorrect();

      try {
        const payload = {
          quiz_template_id: quizTemplateId,
          duration,
          answers: finalAnswers,
        };
        console.log('[Quiz] Submitting quiz:', JSON.stringify(payload, null, 2));
        const result = await quizApi.submitQuiz(payload);

        const overriddenScore = (competitionScore !== undefined && competitionScore > 0)
          ? (result.correct_amount / result.total_questions) * competitionScore 
          : result.score;

        // Register participant for competition leaderboard
        if (competitionId && user?.id) {
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          const joinedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
          try {
            console.log('[Competition] Registering quiz participant:', { competitionId, studentId: user.id, joinedAt, totalScore: Math.round(overriddenScore) });
            await competitionApi.registerParticipant(competitionId, user.id, {
              joinedAt,
              totalScore: Math.round(overriddenScore),
            });
            console.log('[Competition] Quiz participant registered successfully');
          } catch (regErr: any) {
            console.error('Error registering competition participant:', regErr?.response?.status, regErr?.response?.data || regErr?.message);
          }
        }

        navigation.navigate('ExamResult', {
          competitionId,
          quizTitle: result.quiz_title || quizTitle,
          totalQuestions: result.total_questions,
          correctAnswers: result.correct_amount,
          wrongAnswers: result.wrong_amount,
          totalPoints: overriddenScore,
          duration: result.duration,
          placements: result.placements,
        });
      } catch (err: any) {
        console.error('Error submitting quiz:', err?.response?.status, JSON.stringify(err?.response?.data || err?.message));
        navigation.navigate('ExamResult', {
          competitionId,
          quizTitle,
          totalQuestions: questions.length,
          correctAnswers: finalCorrectCount,
          wrongAnswers: questions.length - finalCorrectCount,
          totalPoints: (competitionScore !== undefined && competitionScore > 0)
            ? (finalCorrectCount / questions.length) * competitionScore
            : finalCorrectCount * 10,
          duration,
        });
      }
    },
    [competitionId, quizTemplateId, user?.id, navigation, quizTitle, questions.length, isSubmitting, buildAnswers, countCorrect]
  );

  // Countdown timer
  useEffect(() => {
    if (isLoading || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, questions.length, submitExam]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isTimeLow = timeLeft <= 60;
  const answeredCount = Object.keys(selections).length;

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;
    setSelections(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = () => {
    if (!selectedOption || !currentQuestion) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitExam();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenBackground />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
        </View>
      </View>
    );
  }

  // Error screen
  if (loadError || !currentQuestion) {
    return (
      <View style={styles.container}>
        <ScreenBackground />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.loadingWrap}>
            <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.loadingText}>{loadError || 'Không thể tải câu hỏi.'}</Text>
            <TouchableOpacity
              style={styles.errorBackButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.errorBackText}>Quay lại</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Cuộc thi</Text>
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
            <MaterialCommunityIcons name="check-decagram" size={16} color={ACCENT} />
            <Text style={styles.pointsText}>{answeredCount}/{questions.length}</Text>
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
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
            <Text style={styles.questionSubtext}>Chọn đáp án đúng bên dưới.</Text>
          </View>

          {/* Options - map from string[] */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const label = String.fromCharCode(65 + index); // A, B, C, D...
              return (
                <TouchableOpacity
                  key={`${currentQuestion.id}-${index}`}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleSelectOption(option)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      selectedOption === option && styles.optionIconSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLabel,
                        selectedOption === option && styles.optionLabelSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      selectedOption === option && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Navigation buttons */}
          <View style={styles.navButtonRow}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.prevButton} onPress={handlePrev} activeOpacity={0.8}>
                <MaterialCommunityIcons name="arrow-left" size={22} color={ACCENT} />
                <Text style={styles.prevButtonText}>QUAY LẠI</Text>
              </TouchableOpacity>
            )}
            {selectedOption && (
              <TouchableOpacity
                style={[styles.nextButton, currentIndex === 0 && { flex: 1 }]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex < questions.length - 1 ? 'CÂU TIẾP THEO' : 'NỘP BÀI'}
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={22} color={colors.text.white} />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Submitting overlay */}
      {isSubmitting && (
        <View style={styles.submittingOverlay}>
          <ActivityIndicator size="large" color={colors.text.white} />
          <Text style={styles.submittingText}>Đang nộp bài...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 220 },
  loadingWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  errorBackButton: {
    backgroundColor: ACCENT,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  errorBackText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '700',
  },
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
    backgroundColor: ACCENT_LIGHT,
    borderColor: ACCENT,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  pointsText: {
    color: ACCENT,
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
  optionIconSelected: { backgroundColor: '#FDE68A' },
  optionIconCorrect: { backgroundColor: '#C8E6C9' },
  optionIconWrong: { backgroundColor: '#FFCDD2' },
  optionLabel: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '800',
  },
  optionLabelSelected: { color: '#B45309' },
  optionLabelCorrect: { color: '#2E7D32' },
  optionLabelWrong: { color: '#D32F2F' },
  optionText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  optionTextSelected: { color: '#B45309' },
  optionTextCorrect: { color: '#2E7D32' },
  optionTextWrong: { color: '#D32F2F' },
  // Navigation buttons
  navButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  prevButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: ACCENT,
    borderRadius: 16,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  prevButtonText: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 16,
    elevation: 4,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: 14,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: colors.text.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // Submitting overlay
  submittingOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
  },
  submittingText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.md,
  },
});
