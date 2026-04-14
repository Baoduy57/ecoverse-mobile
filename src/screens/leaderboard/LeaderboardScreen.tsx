import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { colors, spacing, borderRadius } from '../../theme';
import { PodiumDisplay, RankingItem } from '../../components/leaderboard';
import { leaderboardApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { ILeaderboardEntry } from '../../types/leaderboard';

type TabType = 'class' | 'school';
const PAGE_SIZE = 10;

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('class');
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const [entries, setEntries] = useState<ILeaderboardEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { refreshCurrentUser } = useAuthStore();

  // Animations
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current; // 0 for class, 1 for school

  useEffect(() => {
    // Animate tab indicator
    Animated.spring(tabIndicatorAnim, {
      toValue: activeTab === 'class' ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [activeTab]);

  const fetchLeaderboard = useCallback(async (tab: TabType, page: number, append: boolean) => {
      const currentUser = useAuthStore.getState().user;

      if (!currentUser?.partnerId) {
        setEntries([]);
        setHasMore(false);
        setErrorText('Khong tim thay partner_id, vui long dang nhap lai.');
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        setErrorText(null);

        const scope = tab === 'class' ? 'CLASS' : 'SCHOOL';
        const shouldSendGrade = tab === 'class' && typeof currentUser.className === 'string';
        const grade = shouldSendGrade ? currentUser.className?.trim() : undefined;

        const apiRows = await leaderboardApi.getStudentLeaderboard(currentUser.partnerId, {
          scope,
          page,
          size: PAGE_SIZE,
          ...(grade ? { grade } : {}),
        });

        const mappedRows: ILeaderboardEntry[] = apiRows.map((row, index) => ({
          rank: (page - 1) * PAGE_SIZE + index + 1,
          userId: String(row.student_id || ''),
          userName: String(row.student_name || 'Hoc sinh'),
          points: Number(row.points ?? 0),
          grade: row.grade ? String(row.grade) : undefined,
          minDuration:
            typeof row.min_duration === 'number' && Number.isFinite(row.min_duration)
              ? row.min_duration
              : undefined,
          isCurrentUser: String(row.student_id || '') === String(currentUser.id || ''),
        }));

        setEntries(prev => (append ? [...prev, ...mappedRows] : mappedRows));
        setCurrentPage(page);
        setHasMore(apiRows.length === PAGE_SIZE);
      } catch (error: any) {
        const responseStatus = error?.response?.status;
        const responseMessage = error?.response?.data?.message;

        if (responseStatus === 404) {
          setErrorText(responseMessage || 'Not found partner');
        } else {
          setErrorText('Khong the tai bang xep hang. Vui long thu lai.');
        }

        if (!append) {
          setEntries([]);
        }

        setHasMore(false);
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
  }, []);

  const syncLeaderboard = useCallback(async (tab: TabType) => {
    try {
      await refreshCurrentUser(true);
    } finally {
      await fetchLeaderboard(tab, 1, false);
    }
  }, [fetchLeaderboard, refreshCurrentUser]);

  useFocusEffect(
    useCallback(() => {
      syncLeaderboard(activeTab);
    }, [activeTab, syncLeaderboard])
  );

  const handleRefresh = async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    try {
      await syncLeaderboard(activeTab);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);
  };

  const handleLoadMore = () => {
    if (isLoading || isLoadingMore || !hasMore) {
      return;
    }

    fetchLeaderboard(activeTab, currentPage + 1, true);
  };

  const currentData = entries;
  const top3 = currentData.slice(0, 3) as [
    ILeaderboardEntry?,
    ILeaderboardEntry?,
    ILeaderboardEntry?,
  ];
  const remaining = currentData.slice(3);

  const tabWidth = tabContainerWidth > 0 ? (tabContainerWidth - 8) / 2 : 0;
  const indicatorTranslateX = tabIndicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  const indicatorScale = tabIndicatorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.95, 1],
  });

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.titleIconWrap}>
              <MaterialCommunityIcons name="trophy" size={26} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.title}>Bảng xếp hạng</Text>
              <Text style={styles.subtitle}>
                {activeTab === 'class' ? 'Xếp hạng trong lớp' : 'Xếp hạng toàn trường'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View
          style={styles.tabContainer}
          onLayout={e => setTabContainerWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: tabWidth,
                transform: [{ translateX: indicatorTranslateX }, { scale: indicatorScale }],
              },
            ]}
          />
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('class')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="account-group"
              size={18}
              color={activeTab === 'class' ? colors.text.white : colors.text.secondary}
            />
            <Text style={[styles.tabText, activeTab === 'class' && styles.activeTabText]}>Lớp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('school')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="school"
              size={18}
              color={activeTab === 'school' ? colors.text.white : colors.text.secondary}
            />
            <Text style={[styles.tabText, activeTab === 'school' && styles.activeTabText]}>
              Toàn trường
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Dang tai bang xep hang...</Text>
          </View>
        ) : errorText ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={28}
              color={colors.text.secondary}
            />
            <Text style={styles.emptyText}>{errorText}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchLeaderboard(activeTab, 1, false)}
              activeOpacity={0.85}
            >
              <Text style={styles.retryText}>Thu lai</Text>
            </TouchableOpacity>
          </View>
        ) : currentData.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons
              name="format-list-bulleted-square"
              size={28}
              color={colors.text.secondary}
            />
            <Text style={styles.emptyText}>Chua co du lieu bang xep hang</Text>
          </View>
        ) : (
          <>
            {/* Podium */}
            <PodiumDisplay top3={top3} />

            {/* Section label + list */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tu hang 4</Text>
              <Text style={styles.sectionCount}>{remaining.length} hoc sinh</Text>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={colors.primary}
                  colors={[colors.primary]}
                />
              }
            >
              <View style={styles.rankingList}>
                {remaining.map(entry => (
                  <RankingItem
                    key={entry.userId + '-' + entry.rank}
                    entry={entry}
                    isCurrentUser={entry.isCurrentUser}
                  />
                ))}

                {hasMore && (
                  <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={handleLoadMore}
                    disabled={isLoadingMore}
                    activeOpacity={0.85}
                  >
                    {isLoadingMore ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Text style={styles.loadMoreText}>Tai them</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  activeTabText: {
    color: colors.text.white,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.base,
    marginTop: spacing['2xl'],
    padding: spacing.lg,
  },
  header: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  loadMoreButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  loadMoreText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: spacing.sm,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
  },
  rankingList: {
    paddingHorizontal: spacing.base,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '700',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  scrollView: {
    flex: 1,
  },
  sectionCount: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  sectionHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 2,
  },
  tab: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    zIndex: 1,
  },
  tabContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: spacing.md,
    marginHorizontal: spacing.base,
    padding: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabIndicator: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    elevation: 3,
    height: '100%',
    left: 4,
    position: 'absolute',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    top: 4,
  },
  tabText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  titleIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
});
