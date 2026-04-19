import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useIsFocused } from '@react-navigation/native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { colors } from '../../theme';
import TopHeaderBar from '../../components/game/TopHeaderBar';
import GameInfoDialog from '../../components/game/GameInfoDialog';
import GameLevelListItem from '../../components/game/GameLevelListItem';
import type { Level, IGameAttempt, IGameRound } from '../../types/game';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import { useAuthStore } from '../../store/authStore';
import { gameApi } from '../../services/api/game';
import { StatusBar } from 'expo-status-bar';
import { parseApiDate } from '../../utils/helpers';

// ─── helpers ────────────────────────────────────────────────────────────────

const getRoundIcon = (round: IGameRound, index: number): string => {
  const title = round.title.toUpperCase();
  if (title.includes('TÁI CHẾ')) return 'recycle';
  if (title.includes('HỮU CƠ') || title.includes('Ủ')) return 'sprout';
  if (title.includes('NHỰA')) return 'bottle-soda';
  if (title.includes('GIẤY')) return 'file-document-outline';
  if (title.includes('THỦY TINH')) return 'glass-fragile';
  return index % 2 === 0 ? 'tree' : 'leaf';
};

const toSafeNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isMeaningfulAttempt = (attempt: IGameAttempt): boolean => {
  if (attempt.completed) return true;
  return (
    toSafeNumber(attempt.points_earned) > 0 ||
    toSafeNumber(attempt.correct_count) > 0 ||
    toSafeNumber(attempt.duration) > 0
  );
};

const getLatestAttempt = (attempts: IGameAttempt[]): IGameAttempt | undefined => {
  if (!attempts.length) return undefined;
  return [...attempts].sort((a, b) => {
    if (b.attempt_number !== a.attempt_number) return b.attempt_number - a.attempt_number;
    const dateA = parseApiDate(a.updated_at || a.completed_at || a.created_at || a.started_at);
    const dateB = parseApiDate(b.updated_at || b.completed_at || b.created_at || b.started_at);
    const tA = dateA ? dateA.getTime() : 0;
    const tB = dateB ? dateB.getTime() : 0;
    return tB - tA;
  })[0];
};

// ─── screen ─────────────────────────────────────────────────────────────────

export default function GameScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const isFocused = useIsFocused();
  const { user, refreshCurrentUser } = useAuthStore();

  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Thông báo');
  const [dialogMessage, setDialogMessage] = useState('');

  const openDialog = useCallback((title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  }, []);

  // ── fetch ──────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isFocused) return;

    const fetchGameRounds = async () => {
      try {
        if (!user?.id) {
          openDialog('Lỗi', 'Không tìm thấy student_id, vui lòng đăng nhập lại.');
          return;
        }
        if (!user?.partnerId) {
          openDialog('Lỗi', 'Không tìm thấy partner_id, vui lòng đăng nhập lại.');
          return;
        }

        setIsLoading(true);
        await refreshCurrentUser(true);

        const rounds = await gameApi.getGameRounds(user.partnerId, 1, 100, null);
        const active = rounds.filter(r => r.active !== false && r.shared === true);

        if (!active.length) {
          setLevels([]);
          return;
        }

        // Fetch attempts for all rounds in parallel
        let studentAttempts: IGameAttempt[] = [];
        const results = await Promise.allSettled(
          active.map(r => gameApi.getStudentAttempts(r.id, user.id, 1, 50, null))
        );
        studentAttempts = results.flatMap(r => (r.status === 'fulfilled' ? r.value : []));

        const attemptsMap = new Map<string, IGameAttempt[]>();
        studentAttempts.forEach(a => {
          attemptsMap.set(a.game_round_id, [...(attemptsMap.get(a.game_round_id) ?? []), a]);
        });

        const mapped: Level[] = active.map((round, index) => {
          const ra = attemptsMap.get(round.id) ?? [];
          const latest = getLatestAttempt(ra);
          return {
            id: round.id,
            title: round.title,
            icon: getRoundIcon(round, index),
            status: 'completed' as const,
            isCurrent: false,
            description: round.description,
            playsCount: ra.filter(isMeaningfulAttempt).length,
            itemCount: toSafeNumber(round.item_count),
            lastAttemptId: latest?.id,
            lastAttemptNumber: latest?.attempt_number,
          };
        });

        setLevels(mapped);
      } catch (err) {
        console.error('Lỗi khi tải màn chơi:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const task = InteractionManager.runAfterInteractions(fetchGameRounds);
    return () => task.cancel();
  }, [isFocused, refreshCurrentUser, user?.id, user?.partnerId]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handlePlayLevel = useCallback(
    (level: Level) => {
      if ((level.itemCount ?? 0) <= 0) {
        openDialog('Thông báo', 'Màn chơi này chưa có vật phẩm rác để chơi.');
        return;
      }
      navigation.navigate('DragDropGamePlay', { levelId: level.id });
    },
    [navigation, openDialog]
  );

  const handleViewHistory = useCallback(
    (level: Level) => {
      navigation.navigate('GameHistory', {
        gameRoundId: String(level.id),
        gameRoundTitle: level.title,
      });
    },
    [navigation]
  );

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home', { screen: 'Game' } as never);
  }, [navigation]);

  // ── render ─────────────────────────────────────────────────────────────────
  const renderItem: ListRenderItem<Level> = useCallback(
    ({ item, index }) => (
      <GameLevelListItem
        level={item}
        index={index}
        onPlayPress={handlePlayLevel}
        onHistoryPress={handleViewHistory}
      />
    ),
    [handlePlayLevel, handleViewHistory]
  );

  if (isLoading && levels.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" backgroundColor={colors.background} translucent={false} />
        <ScreenBackground />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.background} translucent={false} />
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <TopHeaderBar
          onBack={handleBackPress}
          stats={{
            missions: 0,
            streak: Number(user?.streak ?? 0),
            ecoPoints: Number(user?.points ?? 0),
          }}
        />

        <FlatList
          data={levels}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<View style={styles.footer} />}
        />
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
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  footer: {
    height: 40,
  },
});
