import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { borderRadius, colors, spacing } from '../../theme';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import { useAuthStore } from '../../store/authStore';
import { gameApi } from '../../services/api/game';
import type { IGameAttempt } from '../../types';
import {
  HistoryAttemptCard,
  HistoryHeader,
  HistoryLoadMoreFooter,
  type PlacementStats,
} from '../../components/game/history';

const INITIAL_VISIBLE_COUNT = 5;
const LOAD_MORE_STEP = 5;
const LOAD_MORE_DELAY_MS = 450;

const toTimestamp = (attempt: IGameAttempt) => {
  const value =
    attempt.updated_at || attempt.completed_at || attempt.created_at || attempt.started_at;
  if (!value) return 0;

  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function GameHistoryScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const { user } = useAuthStore();
  const loadMoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildSummaryPayloadFromAttempt = useCallback(
    (attempt: IGameAttempt, stats?: PlacementStats) => {
      const correctAnswers = Math.max(
        0,
        Number.isFinite(Number(stats?.correct))
          ? Number(stats?.correct)
          : Number(attempt.correct_count || 0)
      );
      const totalQuestions = Math.max(
        correctAnswers,
        Number.isFinite(Number(stats?.total))
          ? Number(stats?.total)
          : Number(attempt.total_items || 0)
      );

      return {
        score: Number(attempt.points_earned || 0),
        correctAnswers,
        totalQuestions,
        duration: Math.max(0, Number(attempt.duration || 0)),
        maxCombo: 0,
        completed: Boolean(attempt.completed),
      };
    },
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [attempts, setAttempts] = useState<IGameAttempt[]>([]);
  const [placementStats, setPlacementStats] = useState<Record<string, PlacementStats>>({});
  const [errorText, setErrorText] = useState<string | null>(null);

  const fetchHistory = useCallback(
    async (showLoader: boolean) => {
      if (!user?.id) {
        setErrorText('Khong tim thay student_id. Vui long dang nhap lai.');
        setAttempts([]);
        setPlacementStats({});
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (!user?.partnerId) {
        setErrorText('Khong tim thay partner_id. Vui long dang nhap lai.');
        setAttempts([]);
        setPlacementStats({});
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (showLoader) {
        setIsLoading(true);
      }
      setErrorText(null);

      try {
        const rounds = await gameApi.getGameRounds(user.partnerId, 1, 100, null);
        const mappedRounds = rounds.filter(round => round.active !== false);

        const attemptResults = await Promise.allSettled(
          mappedRounds.map(round => gameApi.getStudentAttempts(round.id, user.id, 1, 100, null))
        );

        const attemptList = attemptResults.flatMap(result =>
          result.status === 'fulfilled' ? result.value : []
        );
        const failedRoundCount = attemptResults.filter(result => result.status === 'rejected').length;

        if (failedRoundCount > 0) {
          console.warn(
            `Không tải được attempts của ${failedRoundCount}/${mappedRounds.length} màn ở lịch sử game.`
          );
        }

        if (mappedRounds.length > 0 && failedRoundCount === mappedRounds.length) {
          throw new Error('Khong the tai lich su attempts cho tat ca round.');
        }

        const dedupedAttempts = Array.from(
          new Map(attemptList.map(attempt => [attempt.id, attempt])).values()
        );

        const sortedAttempts = [...dedupedAttempts].sort((a, b) => {
          const timeDiff = toTimestamp(b) - toTimestamp(a);
          if (timeDiff !== 0) {
            return timeDiff;
          }

          return b.attempt_number - a.attempt_number;
        });

        setAttempts(sortedAttempts);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setHasUserScrolled(false);

        const statsResult = await Promise.allSettled(
          sortedAttempts.map(async attempt => {
            const placements = await gameApi.getPlacementDetails(attempt.id);
            const correctCount = placements.filter(placement => placement.is_correct).length;

            return {
              attemptId: attempt.id,
              total: placements.length,
              correct: correctCount,
            };
          })
        );

        const nextStats: Record<string, PlacementStats> = {};
        statsResult.forEach(result => {
          if (result.status === 'fulfilled') {
            nextStats[result.value.attemptId] = {
              total: result.value.total,
              correct: result.value.correct,
            };
          }
        });

        setPlacementStats(nextStats);
      } catch (error) {
        console.error('Không thể tải lịch sử chơi game:', error);
        setErrorText('Không thể tải lịch sử đã chơi. Vui lòng thử lại.');
        setAttempts([]);
        setPlacementStats({});
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.id, user?.partnerId]
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        fetchHistory(true);
      });
      return () => task.cancel();
    }, [fetchHistory])
  );

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) {
        clearTimeout(loadMoreTimerRef.current);
      }
    };
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchHistory(false);
  };

  const playedAttempts = useMemo(
    () => attempts.filter(attempt => attempt.completed || Number(attempt.total_items) > 0),
    [attempts]
  );

  const visibleAttempts = useMemo(
    () => playedAttempts.slice(0, visibleCount),
    [playedAttempts, visibleCount]
  );

  const hasMore = visibleCount < playedAttempts.length;

  const loadMoreHistory = useCallback(() => {
    if (!hasUserScrolled || !hasMore || isLoadingMore || isLoading || isRefreshing) {
      return;
    }

    setIsLoadingMore(true);
    loadMoreTimerRef.current = setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + LOAD_MORE_STEP, playedAttempts.length));
      setIsLoadingMore(false);
      loadMoreTimerRef.current = null;
    }, LOAD_MORE_DELAY_MS);
  }, [hasUserScrolled, hasMore, isLoadingMore, isLoading, isRefreshing, playedAttempts.length]);

  const handleReplay = useCallback(
    (attempt: IGameAttempt) => {
      navigation.navigate('DragDropGamePlay', {
        levelId: attempt.game_round_id,
        gameAttemptId: attempt.id,
      });
    },
    [navigation]
  );

  const handleViewDetails = useCallback(
    (attempt: IGameAttempt) => {
      navigation.navigate('GameResultDetail', {
        gameAttemptId: attempt.id,
        results: [],
        summary: buildSummaryPayloadFromAttempt(attempt, placementStats[attempt.id]),
      });
    },
    [navigation, placementStats, buildSummaryPayloadFromAttempt]
  );

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <HistoryHeader onBack={() => navigation.goBack()} />

        {isLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={errorText ? [] : visibleAttempts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <HistoryAttemptCard
                attempt={item}
                stats={placementStats[item.id]}
                onReplay={handleReplay}
                onViewDetails={handleViewDetails}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            onScrollBeginDrag={() => setHasUserScrolled(true)}
            onEndReached={loadMoreHistory}
            onEndReachedThreshold={0.18}
            ListHeaderComponent={
              errorText ? (
                <View style={styles.errorCard}>
                  <Text style={styles.errorText}>{errorText}</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              !errorText ? (
                <View style={styles.emptyCard}>
                  <MaterialCommunityIcons name="history" size={34} color={colors.text.secondary} />
                  <Text style={styles.emptyTitle}>Chưa có lịch sử chơi</Text>
                  <Text style={styles.emptySubtitle}>Hay chơi ít nhất 1 màn để có thể replay.</Text>
                </View>
              ) : null
            }
            ListFooterComponent={
              visibleAttempts.length > 0 ? (
                <HistoryLoadMoreFooter isLoadingMore={isLoadingMore} hasMore={hasMore} />
              ) : (
                <View style={styles.footerSpacer} />
              )
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginTop: spacing.base,
    padding: spacing.xl,
  },
  emptySubtitle: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  errorCard: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  footerSpacer: {
    height: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
});
