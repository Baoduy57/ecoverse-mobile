import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { PodiumDisplay, RankingItem } from '../../components/leaderboard';
import type { ILeaderboardEntry } from '../../types/game';

// Mock data - replace with actual API call
const MOCK_CLASS_LEADERBOARD: ILeaderboardEntry[] = [
  {
    rank: 1,
    userId: '1',
    userName: 'Trần Nam',
    avatar: '',
    points: 2440,
    level: 12,
    isCurrentUser: false,
  },
  {
    rank: 2,
    userId: '2',
    userName: 'Minh Anh',
    avatar: '',
    points: 2150,
    level: 11,
    isCurrentUser: false,
  },
  {
    rank: 3,
    userId: '3',
    userName: 'Bảo Ngọc',
    avatar: '',
    points: 1840,
    level: 10,
    isCurrentUser: false,
  },
  {
    rank: 4,
    userId: '4',
    userName: 'Kiddo',
    avatar: '',
    points: 1250,
    level: 8,
    isCurrentUser: true,
  },
  {
    rank: 5,
    userId: '5',
    userName: 'Lê Hoàng',
    avatar: '',
    points: 1750,
    level: 9,
    isCurrentUser: false,
  },
  {
    rank: 6,
    userId: '6',
    userName: 'Thanh Hương',
    avatar: '',
    points: 1620,
    level: 9,
    isCurrentUser: false,
  },
  {
    rank: 7,
    userId: '7',
    userName: 'Gia Bảo',
    avatar: '',
    points: 1580,
    level: 8,
    isCurrentUser: false,
  },
  {
    rank: 8,
    userId: '8',
    userName: 'Thủy Dương',
    avatar: '',
    points: 1490,
    level: 8,
    isCurrentUser: false,
  },
];

const MOCK_SCHOOL_LEADERBOARD: ILeaderboardEntry[] = [
  {
    rank: 1,
    userId: '11',
    userName: 'Nguyễn Anh',
    avatar: '',
    points: 3200,
    level: 15,
    isCurrentUser: false,
  },
  {
    rank: 2,
    userId: '12',
    userName: 'Trần Bình',
    avatar: '',
    points: 2980,
    level: 14,
    isCurrentUser: false,
  },
  {
    rank: 3,
    userId: '13',
    userName: 'Lê Cường',
    avatar: '',
    points: 2750,
    level: 13,
    isCurrentUser: false,
  },
  {
    rank: 4,
    userId: '1',
    userName: 'Trần Nam',
    avatar: '',
    points: 2440,
    level: 12,
    isCurrentUser: false,
  },
  {
    rank: 5,
    userId: '2',
    userName: 'Minh Anh',
    avatar: '',
    points: 2150,
    level: 11,
    isCurrentUser: false,
  },
  {
    rank: 12,
    userId: '4',
    userName: 'Kiddo',
    avatar: '',
    points: 1250,
    level: 8,
    isCurrentUser: true,
  },
];

type TabType = 'class' | 'school';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('class');
  const [tabContainerWidth, setTabContainerWidth] = useState(0);

  // Animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current; // 0 for class, 1 for school

  useEffect(() => {
    // Floating animation for decorative icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Animate tab indicator
    Animated.spring(tabIndicatorAnim, {
      toValue: activeTab === 'class' ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [activeTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const currentData = activeTab === 'class' ? MOCK_CLASS_LEADERBOARD : MOCK_SCHOOL_LEADERBOARD;
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
      {/* Background Decorative Elements */}
      <View style={styles.bgDecorativeTop} />
      <View style={styles.bgDecorativeRight} />
      <View style={styles.bgDecorativeBottom} />

      {/* Floating Icons */}
      <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatAnim1 }] }]}>
        <MaterialCommunityIcons name="leaf" size={100} color="rgba(129, 199, 132, 0.3)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatAnim2 }] }]}>
        <MaterialCommunityIcons name="recycle" size={80} color="rgba(129, 199, 132, 0.3)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon3, { transform: [{ translateY: floatAnim3 }] }]}>
        <MaterialCommunityIcons name="cloud" size={60} color="rgba(144, 202, 249, 0.4)" />
      </Animated.View>

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

        {/* Podium */}
        <PodiumDisplay top3={top3} />

        {/* Section label + list */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Từ hạng 4</Text>
          <Text style={styles.sectionCount}>{remaining.length} học sinh</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.rankingList}>
            {remaining.map(entry => (
              <RankingItem key={entry.userId} entry={entry} isCurrentUser={entry.isCurrentUser} />
            ))}
          </View>
        </ScrollView>
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
  // Background decorative elements
  bgDecorativeTop: {
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    height: '40%',
    left: '-10%',
    opacity: 0.6,
    position: 'absolute',
    top: '-10%',
    width: '70%',
  },
  bgDecorativeRight: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 9999,
    height: '50%',
    position: 'absolute',
    right: '-20%',
    top: '40%',
    width: '80%',
  },
  bgDecorativeBottom: {
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    bottom: '-10%',
    height: '40%',
    left: '10%',
    opacity: 0.5,
    position: 'absolute',
    width: '60%',
  },
  // Floating icons
  floatingIcon1: {
    position: 'absolute',
    right: -20,
    top: '15%',
    zIndex: 0,
  },
  floatingIcon2: {
    bottom: '20%',
    left: -30,
    position: 'absolute',
    zIndex: 0,
  },
  floatingIcon3: {
    left: '5%',
    position: 'absolute',
    top: '40%',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  titleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionCount: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  rankingList: {
    paddingHorizontal: spacing.base,
  },
});
