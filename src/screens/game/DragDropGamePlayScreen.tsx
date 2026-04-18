import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
  useIsFocused,
  StackActions,
} from '@react-navigation/native';
import { colors } from '../../theme';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import { useAuthStore } from '../../store/authStore';
import { gameApi } from '../../services/api/game';
import { competitionApi } from '../../services/api/competition';
import type { IWasteBin, IGameAttempt, IPlacementResponse, BinCode } from '../../types';
import {
  GamePlayHeader,
  GamePlayInstruction,
  GamePlayItemCard,
  GamePlayBins,
  GamePlayResult,
  GamePlayPauseModal,
} from '../../components/game/GamePlay';
import ScreenBackground from '../../components/common/ScreenBackground';
import GameInfoDialog from '../../components/game/GameInfoDialog';
import { useSettingsStore } from '../../store/settingsStore';
import {
  type AnswerSnapshotItem,
  type AttemptSummaryPayload,
  type GameQuestion,
  type GameResultDetailItem,
  buildFallbackResults,
  buildGameQuestions,
  buildPlacementRequests,
  buildServerResults,
  buildSummaryPayload,
  computeTimeLimit,
} from './dragDropGamePlay.helpers';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_POINTS_PER_CORRECT = 10;
const COMBO_THRESHOLD = 3;
const COMBO_MULTIPLIER = 2;

export const WasteTypeObj = {}; // Retained for compatibility where needed by components, though most are decoupled.

type DragDropGamePlayScreenRouteProp = RouteProp<AppStackParamList, 'DragDropGamePlay'>;

export default function DragDropGamePlayScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<DragDropGamePlayScreenRouteProp>();
  const isFocused = useIsFocused();
  const { user, refreshCurrentUser } = useAuthStore();
  const levelId = route.params?.levelId || '';
  const replayAttemptId = route.params?.gameAttemptId;
  const competitionId = route.params?.competitionId;
  const isReplayMode = Boolean(replayAttemptId);
  const isCompetitionMode = Boolean(competitionId);

  const [isLoading, setIsLoading] = useState(true);
  const [bins, setBins] = useState<IWasteBin[]>([]);
  const binsRef = useRef<IWasteBin[]>([]);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [gameAttempt, setGameAttempt] = useState<IGameAttempt | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timer, setTimer] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [feedbackText, setFeedbackText] = useState('Chính xác! +10');
  const [finalSummary, setFinalSummary] = useState<AttemptSummaryPayload | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Thong bao');
  const [dialogMessage, setDialogMessage] = useState('');
  const [shouldGoBackAfterDialog, setShouldGoBackAfterDialog] = useState(false);

  const scoreRef = useRef(0);
  const correctAnswersRef = useRef(0);
  const maxComboRef = useRef(0);
  const timerRef = useRef(60);
  const timeLimitRef = useRef(60);

  const currentQuestion = questions[currentQuestionIndex];

  const openDialog = useCallback((title: string, message: string, goBackAfterClose = false) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setShouldGoBackAfterDialog(goBackAfterClose);
    setDialogVisible(true);
  }, []);

  const closeDialog = useCallback(() => {
    const shouldGoBack = shouldGoBackAfterDialog;
    setDialogVisible(false);
    setShouldGoBackAfterDialog(false);
    if (shouldGoBack && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation, shouldGoBackAfterDialog]);

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedBin, setHighlightedBin] = useState<string | null>(null);
  const [feedbackAnimation] = useState(new Animated.Value(0));
  const [hintAnimation] = useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = useState(false);
  // We dynamic-allocate animated values for bins during load if needed, but 4 is normal
  const binScaleAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  const answeredQuestionsRef = useRef<AnswerSnapshotItem[]>([]);
  const isFinishingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const formattedResultsRef = useRef<GameResultDetailItem[]>([]);
  const handleAnswerRef = useRef<(typeCode: BinCode, binIndex: number, releaseY: number) => void>(
    () => {}
  );

  useEffect(() => {
    if (isGameOver || showResult || isPaused || !isFocused) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        const next = prev <= 1 ? 0 : prev - 1;
        timerRef.current = next;
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, showResult, isPaused, currentQuestionIndex, isFocused]);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        if (!user?.id || !user?.partnerId) {
          openDialog(
            'Loi',
            'Khong tim thay partner_id hoac student_id, vui long dang nhap lai.',
            true
          );
          return;
        }
        setIsLoading(true);

        const [binsData, itemsData] = await Promise.all([
          gameApi.getWasteBins(),
          gameApi.getGameRoundItems(user.partnerId, String(levelId)),
        ]);

        if (!itemsData?.length) {
          openDialog('Thông báo', 'Màn chơi này chưa có vật phẩm rác để chơi.', true);
          return;
        }

        const initialAttemptPayload = {
          duration: 0,
          points_earned: 0,
          total_items: itemsData.length,
          correct_count: 0,
          completed: false,
        };

        const attemptData =
          isReplayMode && replayAttemptId
            ? await gameApi.replayGameRound(replayAttemptId, initialAttemptPayload)
            : await gameApi.createAttempt(String(levelId), user.id, initialAttemptPayload);

        setBins(binsData);
        binsRef.current = binsData;
        setGameAttempt(attemptData);

        const mappedQuestions = buildGameQuestions(itemsData, binsData);
        setQuestions(mappedQuestions);

        const computedTimeLimit = computeTimeLimit(itemsData.length);
        setTimeLimit(computedTimeLimit);
        setTimer(computedTimeLimit);
        timeLimitRef.current = computedTimeLimit;
        timerRef.current = computedTimeLimit;
      } catch (err: unknown) {
        const requestError = err as {
          config?: { baseURL?: string; url?: string };
          response?: { status?: number; data?: { message?: string } };
        };

        if (requestError?.config) {
          console.error(
            `Lỗi khi tải dữ liệu game Drag Drop (${requestError.response?.status || 'NO_STATUS'}): ${requestError.config.baseURL || ''}${requestError.config.url || ''}`
          );
        }
        if (
          requestError?.response?.status === 404 &&
          requestError?.response?.data?.message === 'Waste items not found'
        ) {
          openDialog('Thông báo', 'Không tìm thấy vật phẩm rác cho màn chơi này.', true);
          return;
        }
        console.error('Chi tiết lỗi Drag Drop:', requestError?.response?.data || err);
        openDialog('Lỗi', 'Không thể tải dữ liệu màn chơi. Vui lòng thử lại.', true);
      } finally {
        setIsLoading(false);
      }
    };
    initializeGame();
  }, [user?.id, user?.partnerId, levelId, openDialog, isReplayMode, replayAttemptId]);

  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    opacity.setValue(1);
  }, [currentQuestionIndex, pan, scale, opacity]);

  useEffect(() => {
    bins.forEach((bin, i) => {
      if (binScaleAnims[i]) {
        Animated.timing(binScaleAnims[i], {
          toValue: highlightedBin === bin.code ? 1.08 : 1,
          duration: 120,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [highlightedBin, bins]);

  useEffect(() => {
    if (!isDragging) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(hintAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(hintAnimation, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    }
  }, [isDragging, hintAnimation]);

  const BINS_BOTTOM_THRESHOLD = SCREEN_HEIGHT - 220;

  const getBinIndexFromPosition = useCallback((moveX: number, moveY: number) => {
    const currentBins = binsRef.current;
    const itemY = SCREEN_HEIGHT / 2 + moveY;
    if (itemY <= BINS_BOTTOM_THRESHOLD) return -1;
    const binIndex = Math.floor((moveX / SCREEN_WIDTH) * currentBins.length);
    return binIndex >= 0 && binIndex < currentBins.length ? binIndex : -1;
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimatingRef.current,
      onPanResponderGrant: () => {
        if (isAnimating) return;
        setIsDragging(true);
        Animated.timing(scale, { toValue: 1.1, duration: 100, useNativeDriver: true }).start();
      },
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
        const binIndex = getBinIndexFromPosition(gesture.moveX, gesture.dy);
        const currentBins = binsRef.current;
        setHighlightedBin(binIndex >= 0 ? currentBins[binIndex].code : null);
      },
      onPanResponderRelease: (_, gesture) => {
        setIsDragging(false);
        setHighlightedBin(null);
        const binIndex = getBinIndexFromPosition(gesture.moveX, gesture.dy);
        const droppedInBin = binIndex >= 0;
        const currentBins = binsRef.current;
        if (droppedInBin) {
          handleAnswerRef.current(currentBins[binIndex].code as BinCode, binIndex, gesture.dy);
        } else {
          Animated.parallel([
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const resetPanAndScale = useCallback(() => {
    pan.setValue({ x: 0, y: 0 });
    opacity.setValue(1);
    scale.setValue(1);
  }, [pan, scale, opacity]);

  const handleAnswer = useCallback(
    (selectedTypeCode: BinCode, _binIndex: number, releaseY: number) => {
      if (!currentQuestion) return;
      const isCorrect = selectedTypeCode === currentQuestion.item.correct_bin_code;
      isAnimatingRef.current = true;
      setIsAnimating(true);

      answeredQuestionsRef.current = [
        ...answeredQuestionsRef.current,
        { item: currentQuestion.item, userAnswerCode: selectedTypeCode, isCorrect },
      ];

      if (!isCorrect) setCombo(0);

      if (isCorrect) {
        const newCombo = combo + 1;
        const multiplier = newCombo >= COMBO_THRESHOLD ? COMBO_MULTIPLIER : 1;
        const scoreToAdd = BASE_POINTS_PER_CORRECT * multiplier;

        setFeedbackText(
          multiplier > 1
            ? `Chính xác! +${scoreToAdd} (x${multiplier})`
            : `Chính xác! +${scoreToAdd}`
        );

        Animated.parallel([
          Animated.timing(scale, { toValue: 0.12, duration: 250, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true, delay: 50 }),
        ]).start(() => {
          setScore(prev => {
            const next = prev + scoreToAdd;
            scoreRef.current = next;
            return next;
          });
          setCombo(newCombo);
          setMaxCombo(prev => {
            const next = Math.max(prev, newCombo);
            maxComboRef.current = next;
            return next;
          });
          setCorrectAnswers(prev => {
            const next = prev + 1;
            correctAnswersRef.current = next;
            return next;
          });
          feedbackAnimation.setValue(0);
          Animated.timing(feedbackAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            Animated.timing(feedbackAnimation, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start();
          });

          if (currentQuestionIndex < questions.length - 1) {
            // Chuẩn bị sẵn Data câu tiếp theo dưới nền (tàng hình)
            pan.setValue({ x: 0, y: 0 });
            scale.setValue(0.9); // Bắt đầu nhỏ hơn 1 chút để tạo hiệu ứng bật lên
            setCurrentQuestionIndex(prev => prev + 1);

            // Chờ hết 1000ms của popup điểm thì mới hiện hình mới lên
            setTimeout(() => {
              Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.spring(scale, {
                  toValue: 1,
                  friction: 8,
                  tension: 50,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                isAnimatingRef.current = false;
                setIsAnimating(false);
              });
            }, 1000);
          } else {
            setTimeout(() => {
              isAnimatingRef.current = false;
              setIsAnimating(false);
              handleGameOver();
            }, 1000);
          }
        });
      } else {
        if (useSettingsStore.getState().vibrationEnabled) {
          Vibration.vibrate(400);
        }
        correctAnswersRef.current = answeredQuestionsRef.current.filter(
          answer => answer.isCorrect
        ).length;
        const shakeSteps = [-12, 12, -10, 10, -6, 6, 0];
        const anims = shakeSteps.map(xVal =>
          Animated.timing(pan, {
            toValue: { x: xVal, y: releaseY },
            duration: 50,
            useNativeDriver: true,
          })
        );
        Animated.sequence(anims).start(() => {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start();
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start(() => {
            resetPanAndScale();
            isAnimatingRef.current = false;
            setIsAnimating(false);
            if (currentQuestionIndex < questions.length - 1) {
              setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 200);
            } else {
              handleGameOver();
            }
          });
        });
      }
    },
    [
      currentQuestion,
      currentQuestionIndex,
      questions.length,
      pan,
      scale,
      feedbackAnimation,
      resetPanAndScale,
      combo,
      opacity,
    ]
  );
  handleAnswerRef.current = handleAnswer;

  const handleGameOver = async () => {
    if (isFinishingRef.current) {
      return;
    }
    isFinishingRef.current = true;
    setIsGameOver(true);

    const playedSeconds = Math.max(0, timeLimitRef.current - timerRef.current);
    const answerSnapshot = answeredQuestionsRef.current;
    const correctCount = answerSnapshot.filter(answer => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const finalScore = scoreRef.current;
    const finalMaxCombo = maxComboRef.current;

    let summaryPayload: AttemptSummaryPayload = buildSummaryPayload(
      finalScore,
      correctCount,
      totalQuestions,
      playedSeconds,
      finalMaxCombo
    );

    const fallbackResults: GameResultDetailItem[] = buildFallbackResults(answerSnapshot, bins);

    formattedResultsRef.current = fallbackResults;

    if (gameAttempt) {
      const targetAttemptId = isReplayMode ? replayAttemptId || gameAttempt.id : gameAttempt.id;

      if (!targetAttemptId) {
        console.error('Thiếu game attempt id khi chốt kết quả màn chơi.');
        setFinalSummary(summaryPayload);
        setShowResult(true);
        isFinishingRef.current = false;
        return;
      }

      const attemptPayload = {
        duration: playedSeconds,
        points_earned: finalScore,
        total_items: totalQuestions,
        correct_count: correctCount,
        completed: true,
      };

      const placementRequests = buildPlacementRequests(answerSnapshot);

      const savePlacements = async (): Promise<IPlacementResponse[]> => {
        if (!placementRequests.length) {
          return [];
        }

        const gameRoundId = String(levelId || gameAttempt.game_round_id || '');

        if (!isReplayMode) {
          if (!gameRoundId) {
            console.error('Thiếu game_round_id khi lưu placements lần đầu.');
            return [];
          }
          return gameApi.createPlacements(gameRoundId, targetAttemptId, placementRequests);
        }

        try {
          return await gameApi.updateAttemptPlacements(targetAttemptId, placementRequests);
        } catch (error: unknown) {
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status === 404 && gameRoundId) {
            console.warn(
              'Endpoint update placements cho replay không tồn tại (404), fallback sang create placements.'
            );
            return gameApi.createPlacements(gameRoundId, targetAttemptId, placementRequests);
          }
          throw error;
        }
      };

      const savePlacementsPromise = savePlacements();

      const settleResults = await Promise.allSettled([
        gameApi.updateAttempt(targetAttemptId, attemptPayload),
        savePlacementsPromise,
      ]);

      const updateAttemptResult = settleResults[0];
      const savePlacementsResult = settleResults[1];

      if (updateAttemptResult.status === 'fulfilled') {
        const updatedAttempt = updateAttemptResult.value;
        setGameAttempt(prev => ({
          ...(prev || updatedAttempt),
          ...updatedAttempt,
        }));

        // Sync latest points from backend right after attempt finalization.
        refreshCurrentUser(true);
        setTimeout(() => {
          refreshCurrentUser(true);
        }, 1200);
      } else {
        console.error(
          `Lỗi khi chốt attempt ${isReplayMode ? 'replay' : 'lần đầu'}:`,
          updateAttemptResult.reason
        );
      }

      if (savePlacementsResult.status === 'fulfilled') {
        const placementsResponse = savePlacementsResult.value;
        if (placementsResponse.length) {
          const serverResults: GameResultDetailItem[] = buildServerResults(
            placementsResponse,
            bins
          );
          formattedResultsRef.current = serverResults;
        }
      } else {
        console.error(
          `Lỗi khi lưu placements ${isReplayMode ? 'replay' : 'lần đầu'}:`,
          savePlacementsResult.reason
        );
      }
    }

    setFinalSummary(summaryPayload);
    setShowResult(true);

    // Competition mode: register participant on leaderboard
    if (isCompetitionMode && competitionId && user?.id) {
      try {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const joinedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const body = {
          joinedAt,
          totalScore: Math.round(finalScore),
        };
        console.log('[Competition] Registering participant:', { competitionId, studentId: user.id, body });
        await competitionApi.registerParticipant(competitionId, user.id, body);
        console.log('[Competition] Participant registered successfully');
      } catch (regErr: any) {
        console.error('Error registering competition game participant:', regErr?.response?.status, regErr?.response?.data || regErr?.message);
      }
    }

    isFinishingRef.current = false;
  };

  const handleViewDetails = () => {
    const summaryPayload =
      finalSummary ||
      buildSummaryPayload(
        scoreRef.current,
        correctAnswersRef.current,
        questions.length,
        Math.max(0, timeLimitRef.current - timerRef.current),
        maxComboRef.current
      );

    navigation.navigate('GameResultDetail', {
      gameAttemptId: gameAttempt?.id,
      skipServerRefresh: isReplayMode,
      results: formattedResultsRef.current,
      summary: summaryPayload,
    });
  };

  const handlePlayAgain = () => {
    const nextAttemptId = gameAttempt?.id || replayAttemptId;
    navigation.dispatch(
      StackActions.replace('DragDropGamePlay', {
        levelId,
        gameAttemptId: nextAttemptId,
      })
    );
  };

  const handleGoHome = () => {
    navigation.navigate('Home', { screen: 'Game' } as never);
  };

  if (showResult) {
    const resultSummary =
      finalSummary ||
      buildSummaryPayload(
        scoreRef.current,
        correctAnswersRef.current,
        questions.length,
        Math.max(0, timeLimitRef.current - timerRef.current),
        maxComboRef.current
      );

    return (
      <>
        <GamePlayResult
          score={resultSummary.score}
          correctAnswers={resultSummary.correctAnswers}
          totalQuestions={resultSummary.totalQuestions}
          duration={resultSummary.duration}
          maxCombo={resultSummary.maxCombo}
          completed={resultSummary.completed}
          onViewDetails={handleViewDetails}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
        <GameInfoDialog
          visible={dialogVisible}
          title={dialogTitle}
          message={dialogMessage}
          onClose={closeDialog}
        />
      </>
    );
  }

  // Keep dialog visible even when game data is missing.
  if (isLoading || !currentQuestion || bins.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenBackground />
        <GameInfoDialog
          visible={dialogVisible}
          title={dialogTitle}
          message={dialogMessage}
          onClose={closeDialog}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <GamePlayHeader
          gameModeLabel={'Bài tập vòng ' + gameAttempt?.attempt_number}
          timer={timer}
          timeLimit={timeLimit}
          combo={combo}
          score={score}
          onPause={() => setIsPaused(true)}
          onSettings={() => setIsPaused(true)}
          currentQuestionIndex={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <GamePlayInstruction feedbackAnimation={feedbackAnimation} feedbackText={feedbackText} />

        <GamePlayItemCard
          item={currentQuestion.item}
          pan={pan}
          scale={scale}
          opacity={opacity}
          panHandlers={panResponder.panHandlers}
          feedbackAnimation={feedbackAnimation}
          isDragging={isDragging}
          hintAnimation={hintAnimation}
        />

        <GamePlayBins bins={bins} highlightedBin={highlightedBin} binScaleAnims={binScaleAnims} />

        <GamePlayPauseModal
          visible={isPaused}
          onResume={() => setIsPaused(false)}
          onReplay={() => {
            setIsPaused(false);
            handlePlayAgain();
          }}
          onGoHome={() => {
            setIsPaused(false);
            handleGoHome();
          }}
        />
      </SafeAreaView>

      <GameInfoDialog
        visible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onClose={closeDialog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
});
