import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useIsFocused } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import ScreenBackground from '../../components/common/ScreenBackground';
import { colors } from '../../theme';
import TopHeaderBar from '../../components/game/TopHeaderBar';
import CurrentStageCard from '../../components/game/CurrentStageCard';
import LearningPathNode from '../../components/game/LearningPathNode';
import BackgroundDecorations from '../../components/game/BackgroundDecorations';
import UnitSeparator from '../../components/game/UnitSeparator';
import GameInfoDialog from '../../components/game/GameInfoDialog';
import type { Level, IGameRound, IGameAttempt } from '../../types/game';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import { useAuthStore } from '../../store/authStore';
import { gameApi } from '../../services/api/game';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LEVEL_HEIGHT = 120; // Vertical spacing between nodes
const START_OFFSET_Y = 50;
const LESSONS_PER_UNIT = 7; // Number of lessons per unit
const SEPARATOR_HEIGHT = 60; // Height of separator between units

const getRoundIcon = (round: IGameRound, index: number) => {
  const title = round.title.toUpperCase();
  if (title.includes('TÁI CHẾ')) return 'recycle';
  if (title.includes('HỮU CƠ') || title.includes('Ủ')) return 'sprout';
  if (title.includes('NHỰA')) return 'bottle-soda';
  if (title.includes('GIẤY')) return 'file-document-outline';
  if (title.includes('THỦY TINH')) return 'glass-fragile';
  return index % 2 === 0 ? 'tree' : 'recycle';
};

const toSafeNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isMeaningfulAttempt = (attempt: IGameAttempt) => {
  if (attempt.completed) return true;

  return (
    toSafeNumber(attempt.points_earned) > 0 ||
    toSafeNumber(attempt.correct_count) > 0 ||
    toSafeNumber(attempt.duration) > 0
  );
};

// Helper: Calculate node position with wavy pattern and unit offsets
const getNodePosition = (index: number) => {
  const unitIndex = Math.floor(index / LESSONS_PER_UNIT);
  const unitOffset = unitIndex * SEPARATOR_HEIGHT;

  const y = START_OFFSET_Y + index * LEVEL_HEIGHT + unitOffset;
  // Sine wave with smooth frequency for natural roadmap feel
  const x = SCREEN_WIDTH / 2 + SCREEN_WIDTH * 0.3 * Math.sin(index * 0.8);
  return { x, y };
};

const applyCurrentStage = (levels: Level[], selectedId: string | number) => {
  const selectedIdNormalized = String(selectedId);

  return levels.map(level => {
    const isCurrent = String(level.id) === selectedIdNormalized;
    const status: Level['status'] = isCurrent ? 'current' : 'completed';

    return {
      ...level,
      isCurrent,
      status,
    };
  });
};

export default function GameScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const isFocused = useIsFocused();
  const { user, refreshCurrentUser } = useAuthStore();
  const [learningPath, setLearningPath] = React.useState<Level[]>([]);
  const [selectedStage, setSelectedStage] = useState<Level | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Thong bao');
  const [dialogMessage, setDialogMessage] = useState('');

  const openDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    const fetchGameRounds = async () => {
      try {
        if (!user?.id) {
          openDialog('Loi', 'Khong tim thay student_id, vui long dang nhap lai.');
          return;
        }

        if (!user?.partnerId) {
          openDialog('Loi', 'Khong tim thay partner_id, vui long dang nhap lai.');
          return;
        }

        setIsLoading(true);
        await refreshCurrentUser(true);

        const rounds = await gameApi.getGameRounds(user.partnerId, 1, 10, null);

        let studentAttempts: IGameAttempt[] = [];
        try {
          studentAttempts = await gameApi.getStudentAttempts(user.id, 1, 50, null);
        } catch (attemptsError) {
          console.warn(
            'Không tải được lịch sử attempts, tiếp tục hiển thị danh sách rounds.',
            attemptsError
          );
        }

        const attemptsMap = new Map<string, IGameAttempt[]>();
        studentAttempts.forEach(attempt => {
          const current = attemptsMap.get(attempt.game_round_id) || [];
          attemptsMap.set(attempt.game_round_id, [...current, attempt]);
        });

        const mappedRounds = rounds.filter(round => round.active !== false);

        if (!mappedRounds.length) {
          setLearningPath([]);
          setSelectedStage(undefined);
          return;
        }

        const firstUnplayedRoundIndex = mappedRounds.findIndex(round => {
          const attempts = attemptsMap.get(round.id) || [];
          const validAttempts = attempts.filter(isMeaningfulAttempt);
          return validAttempts.length === 0;
        });

        const currentRoundIndex =
          firstUnplayedRoundIndex === -1
            ? Math.max(mappedRounds.length - 1, 0)
            : firstUnplayedRoundIndex;

        const levels: Level[] = mappedRounds.map((round, index) => {
          const attempts = (attemptsMap.get(round.id) || []).filter(isMeaningfulAttempt);
          const isCurrent = index === currentRoundIndex;
          const status: Level['status'] = isCurrent ? 'current' : 'completed';

          return {
            id: round.id,
            title: round.title,
            icon: getRoundIcon(round, index),
            status,
            isCurrent,
            description: round.description,
            playsCount: attempts.length,
            itemCount: toSafeNumber(round.item_count),
          };
        });

        const defaultStage = levels.find(level => level.isCurrent) || levels[0];
        const normalizedLevels = applyCurrentStage(levels, defaultStage.id);

        setLearningPath(normalizedLevels);
        setSelectedStage(normalizedLevels.find(level => level.isCurrent) || normalizedLevels[0]);
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'isAxiosError' in error &&
          (error as { isAxiosError?: boolean }).isAxiosError
        ) {
          const axiosError = error as {
            config?: { baseURL?: string; url?: string };
            response?: { status?: number };
          };
          if (axiosError.config) {
            console.error(
              `Lỗi request URL (${axiosError.response?.status || 'NO_STATUS'}): ${axiosError.config.baseURL || ''}${axiosError.config.url || ''}`
            );
          }
        }
        console.error('Lỗi khi tải màn chơi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameRounds();
  }, [isFocused, refreshCurrentUser, user?.id, user?.partnerId]);

  // Generate SVG Path segments (one per unit, breaking at separators)
  const pathSegments = useMemo(() => {
    const segments: string[] = [];
    const numberOfUnits = Math.ceil(learningPath.length / LESSONS_PER_UNIT);

    for (let unitIndex = 0; unitIndex < numberOfUnits; unitIndex++) {
      const startIdx = unitIndex * LESSONS_PER_UNIT;
      const endIdx = Math.min(startIdx + LESSONS_PER_UNIT, learningPath.length);

      if (startIdx >= learningPath.length) break;

      let d = `M${getNodePosition(startIdx).x} ${getNodePosition(startIdx).y}`;

      for (let i = startIdx; i < endIdx - 1; i++) {
        const p1 = getNodePosition(i);
        const p2 = getNodePosition(i + 1);

        // Bezier control points for smooth curves
        const cp1x = p1.x;
        const cp1y = p1.y + LEVEL_HEIGHT / 2;
        const cp2x = p2.x;
        const cp2y = p2.y - LEVEL_HEIGHT / 2;

        d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
      }

      segments.push(d);
    }

    return segments;
  }, [learningPath]);

  // Generate completed path segments (green solid line)
  const completedPathSegments = useMemo(() => {
    const segments: string[] = [];
    const currentIndex = learningPath.findIndex(l => l.status === 'current');
    if (currentIndex <= 0) return segments;

    const numberOfUnits = Math.ceil(currentIndex / LESSONS_PER_UNIT);

    for (let unitIndex = 0; unitIndex < numberOfUnits; unitIndex++) {
      const startIdx = unitIndex * LESSONS_PER_UNIT;
      const endIdx = Math.min(startIdx + LESSONS_PER_UNIT, currentIndex + 1);

      if (startIdx >= currentIndex) break;

      let d = `M${getNodePosition(startIdx).x} ${getNodePosition(startIdx).y}`;

      for (let i = startIdx; i < endIdx - 1; i++) {
        const p1 = getNodePosition(i);
        const p2 = getNodePosition(i + 1);

        const cp1x = p1.x;
        const cp1y = p1.y + LEVEL_HEIGHT / 2;
        const cp2x = p2.x;
        const cp2y = p2.y - LEVEL_HEIGHT / 2;

        d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
      }

      segments.push(d);
    }

    return segments;
  }, [learningPath]);

  const handleLevelPress = (level: Level) => {
    if ((level.itemCount ?? 0) <= 0) {
      openDialog('Thông báo', 'Màn chơi này chưa có vật phẩm rác để chơi.');
      return;
    }

    const updatedPath = applyCurrentStage(learningPath, level.id);
    setLearningPath(updatedPath);
    setSelectedStage(updatedPath.find(item => String(item.id) === String(level.id)) || level);
  };

  const handlePlayPress = () => {
    if (!selectedStage) return;

    if ((selectedStage.itemCount ?? 0) <= 0) {
      openDialog('Thông báo', 'Màn chơi này chưa có vật phẩm rác để chơi.');
      return;
    }

    navigation.navigate('DragDropGamePlay', { levelId: selectedStage.id });
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home', { screen: 'Game' } as never);
  };

  const numberOfSeparators = Math.floor(learningPath.length / LESSONS_PER_UNIT);
  const contentHeight =
    START_OFFSET_Y +
    learningPath.length * LEVEL_HEIGHT +
    numberOfSeparators * SEPARATOR_HEIGHT +
    100;

  if (isLoading && learningPath.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.background} translucent={false} />

      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <TopHeaderBar
          onBack={handleBackPress}
          stats={{
            missions: 0,
            streak: Number(user?.streak ?? 0),
            ecoPoints: Number(user?.points ?? 0),
          }}
        />

        {/* Game Content Container with Green Background */}
        <View style={styles.gameContent}>
          {/* Current Stage Card */}
          {selectedStage && <CurrentStageCard stage={selectedStage} onPlay={handlePlayPress} />}

          {/* Learning Path */}
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { height: contentHeight }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Background Decorations */}
            <BackgroundDecorations width={SCREEN_WIDTH} height={contentHeight} />

            {/* SVG Path Background */}
            <Svg style={StyleSheet.absoluteFill} height={contentHeight} width={SCREEN_WIDTH}>
              {/* Roadmap base path */}
              {pathSegments.map((pathData, index) => (
                <Path
                  key={`base-${index}`}
                  d={pathData}
                  stroke={colors.text.disabled}
                  strokeWidth="6"
                  strokeDasharray="10, 10"
                  strokeLinecap="round"
                  fill="none"
                />
              ))}

              {/* Completed path segments (green solid) */}
              {completedPathSegments.map((pathData, index) => (
                <Path
                  key={`completed-${index}`}
                  d={pathData}
                  stroke={colors.primaryDark}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
            </Svg>

            {/* Unit Separators */}
            {Array.from({ length: numberOfSeparators }).map((_, unitIndex) => {
              const lastNodeInUnit = (unitIndex + 1) * LESSONS_PER_UNIT - 1;
              const separatorY = getNodePosition(lastNodeInUnit).y + LEVEL_HEIGHT / 2 + 10;

              return (
                <UnitSeparator
                  key={`separator-${unitIndex}`}
                  y={separatorY}
                  width={SCREEN_WIDTH}
                  unitIndex={unitIndex}
                />
              );
            })}

            {/* Nodes */}
            {learningPath.map((level, index) => {
              return (
                <LearningPathNode
                  key={level.id}
                  level={level}
                  position={getNodePosition(index)}
                  onPress={handleLevelPress}
                />
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>

      <GameInfoDialog
        visible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onClose={() => setDialogVisible(false)}
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
  gameContent: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 50,
  },
});
