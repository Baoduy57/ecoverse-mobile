import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { colors } from '../../theme';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import {
  WasteType,
  BINS,
  getWasteItemsForLevel,
  getLevelConfig,
  type WasteItem,
} from '../../data/dragDropGameData';
import {
  GamePlayHeader,
  GamePlayInstruction,
  GamePlayItemCard,
  GamePlayBins,
  GamePlayResult,
  GamePlayPauseModal,
} from '../../components/game/GamePlay';
import ScreenBackground from '../../components/common/ScreenBackground';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export { WasteType };

interface GameQuestion {
  item: WasteItem;
  options: WasteType[];
}

type DragDropGamePlayScreenRouteProp = RouteProp<AppStackParamList, 'DragDropGamePlay'>;

export default function DragDropGamePlayScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<DragDropGamePlayScreenRouteProp>();
  const levelId = route.params?.levelId || 1;
  const levelConfig = getLevelConfig(levelId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timer, setTimer] = useState(levelConfig.timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Array<{ item: WasteItem; userAnswer: WasteType; isCorrect: boolean }>
  >([]);

  const [questions] = useState<GameQuestion[]>(() => {
    const items = getWasteItemsForLevel(levelId, levelConfig.itemCount);
    return items.map(item => ({
      item,
      options: [WasteType.ORGANIC, WasteType.RECYCLABLE, WasteType.HAZARDOUS, WasteType.OTHER],
    }));
  });

  const currentQuestion = questions[currentQuestionIndex];

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedBin, setHighlightedBin] = useState<WasteType | null>(null);
  const [feedbackAnimation] = useState(new Animated.Value(0));
  const [hintAnimation] = useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = useState(false);
  const binScaleAnims = useRef(BINS.map(() => new Animated.Value(1))).current;

  const BINS_BOTTOM_THRESHOLD = SCREEN_HEIGHT - 220;
  const isAnimatingRef = useRef(false);
  const handleAnswerRef = useRef<(type: WasteType, binIndex: number, releaseY: number) => void>(
    () => { }
  );

  useEffect(() => {
    if (isGameOver || showResult || isPaused) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, showResult, isPaused, currentQuestionIndex]);

  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    opacity.setValue(1);
  }, [currentQuestionIndex, pan, scale, opacity]);

  useEffect(() => {
    BINS.forEach((bin, i) => {
      Animated.timing(binScaleAnims[i], {
        toValue: highlightedBin === bin.type ? 1.08 : 1,
        duration: 120,
        useNativeDriver: true,
      }).start();
    });
  }, [highlightedBin]);

  useEffect(() => {
    if (!isDragging) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(hintAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(hintAnimation, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isDragging]);

  const getBinIndexFromPosition = useCallback((moveX: number, moveY: number) => {
    const itemY = SCREEN_HEIGHT / 2 + moveY;
    if (itemY <= BINS_BOTTOM_THRESHOLD) return -1;
    const binIndex = Math.floor((moveX / SCREEN_WIDTH) * 4);
    return binIndex >= 0 && binIndex < 4 ? binIndex : -1;
  }, []);

  const getSnapTarget = useCallback((binIndex: number) => {
    const binCenterX = (2 * binIndex + 1) * (SCREEN_WIDTH / 8) - SCREEN_WIDTH / 2;
    const targetY = SCREEN_HEIGHT * 0.35;
    return { x: binCenterX, y: targetY };
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
        setHighlightedBin(binIndex >= 0 ? BINS[binIndex].type : null);
      },
      onPanResponderRelease: (_, gesture) => {
        setIsDragging(false);
        setHighlightedBin(null);
        const binIndex = getBinIndexFromPosition(gesture.moveX, gesture.dy);
        const droppedInBin = binIndex >= 0;
        if (droppedInBin) {
          handleAnswerRef.current(BINS[binIndex].type, binIndex, gesture.dy);
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
    (selectedType: WasteType, binIndex: number, releaseY: number) => {
      if (!currentQuestion) return;
      const isCorrect = selectedType === currentQuestion.item.type;
      isAnimatingRef.current = true;
      setIsAnimating(true);

      setAnsweredQuestions(prev => [
        ...prev,
        { item: currentQuestion.item, userAnswer: selectedType, isCorrect },
      ]);

      if (!isCorrect) setCombo(0);

      if (isCorrect) {
        const target = getSnapTarget(binIndex);
        Animated.parallel([
          Animated.timing(pan, { toValue: target, duration: 280, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.4, duration: 280, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]).start(() => {
          setScore(prev => prev + 300);
          setCorrectAnswers(prev => prev + 1);
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
                Animated.spring(scale, { toValue: 1, friction: 8, tension: 50, useNativeDriver: true })
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
        Vibration.vibrate(400);
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
      getSnapTarget,
      feedbackAnimation,
      resetPanAndScale,
    ]
  );
  handleAnswerRef.current = handleAnswer;

  const handleGameOver = () => {
    setIsGameOver(true);
    setShowResult(true);
  };

  const getBinConfig = (type: WasteType) => BINS.find(bin => bin.type === type);

  const handleViewDetails = () => {
    const formattedResults = answeredQuestions.map(answer => {
      const binConfig = getBinConfig(answer.item.type);
      return {
        id: answer.item.id,
        name: answer.item.name,
        icon: answer.item.icon,
        description: answer.item.description,
        correctType: binConfig?.name || '',
        correctTypeIcon: binConfig?.icon || 'delete',
        userAnswer: getBinConfig(answer.userAnswer)?.name || '',
        isCorrect: answer.isCorrect,
        color: binConfig?.color || colors.primary,
      };
    });
    navigation.navigate('GameResultDetail', { results: formattedResults });
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setCombo(0);
    setTimer(levelConfig.timeLimit);
    setIsGameOver(false);
    setShowResult(false);
    setAnsweredQuestions([]);

    pan.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    opacity.setValue(1);
  };

  const handleGoHome = () => {
    navigation.navigate('Home', { screen: 'Game' } as never);
  };

  if (showResult) {
    return (
      <GamePlayResult
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        onViewDetails={handleViewDetails}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    );
  }

  if (!currentQuestion) return null;

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <GamePlayHeader
          gameModeLabel={levelConfig.gameModeLabel}
          timer={timer}
          timeLimit={levelConfig.timeLimit}
          combo={combo}
          score={score}
          onPause={() => setIsPaused(true)}
          onSettings={() => setIsPaused(true)}
          currentQuestionIndex={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <GamePlayInstruction feedbackAnimation={feedbackAnimation} />

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

        <GamePlayBins highlightedBin={highlightedBin} binScaleAnims={binScaleAnims} />

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
