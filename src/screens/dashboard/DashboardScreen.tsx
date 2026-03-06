import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Text, Surface, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import {
  DashboardHeader,
  GameCard,
  ProgressCard,
  SectionHeader,
  CircularProgress,
} from '../../components/dashboard';
import { colors, spacing, borderRadius } from '@theme';
import { getUnreadCount } from '../../data/notificationData';

type DashboardNavigationProp = StackNavigationProp<AppStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();

  // Animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

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
  // Data cho Progress Card
  const progressData = [
    {
      id: '1',
      icon: 'book-open-variant',
      iconColor: '#6366F1',
      iconBgColor: '#EEF2FF',
      title: 'Bài học',
      progress: 0.8,
      value: '80%',
      barColor: '#6366F1',
    },
    {
      id: '2',
      icon: 'flag-checkered',
      iconColor: '#10B981',
      iconBgColor: '#D1FAE5',
      title: 'Mục tiêu',
      progress: 0.8,
      value: '12/15',
      barColor: '#10B981',
    },
    {
      id: '3',
      icon: 'trophy',
      iconColor: '#F97316',
      iconBgColor: '#FFEDD5',
      title: 'Thử thách',
      progress: 0.76,
      value: '450 XP',
      barColor: '#F97316',
    },
  ];

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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Component */}
          <DashboardHeader
            userName="Kiddo!"
            avatarSource={require('../../../assets/images/default-avatar.jpg')}
            streakCount={5}
            coinCount={1250}
            notificationCount={getUnreadCount()}
            onNotificationPress={() => navigation.navigate('Notification')}
          />

          {/* Game Cards */}
          <View style={styles.gameCards}>
            <GameCard
              title={'Thử thách\ntrò chơi'}
              icon="gamepad-variant"
              buttonText="Bắt đầu"
              buttonIcon="play"
              backgroundColor={colors.primary}
              onPress={() => console.log('Game pressed')}
              illustration={require('../../../assets/images/bin.png')}
            />
            <GameCard
              title={'Công cụ\nAI'}
              icon="robot"
              buttonText="Quét"
              buttonIcon="camera"
              backgroundColor={colors.accentBlue}
              onPress={() => navigation.navigate('AIScanner')}
              illustration={require('../../../assets/images/ai.png')}
            />
          </View>

          {/* Bài tập kiểm tra */}
          <View style={styles.section}>
            <SectionHeader
              title="Bài tập kiểm tra"
              linkText="Xem tất cả"
              onLinkPress={() => navigation.navigate('QuizList')}
            />

            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('QuizList')}>
              <View style={styles.quizCard}>
                <View style={styles.quizLeftSection}>
                  <View style={styles.quizIconBox}>
                    <MaterialCommunityIcons name="clipboard-check" size={32} color="#8B5CF6" />
                  </View>
                </View>
                <View style={styles.quizContent}>
                  <View style={styles.quizBadge}>
                    <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.quizBadgeText}>Quiz tuần</Text>
                  </View>
                  <Text style={styles.quizTitle}>Kiểm thức cơ bản</Text>
                  <View style={styles.quizMetaRow}>
                    <View style={styles.quizMetaItem}>
                      <MaterialCommunityIcons name="help-circle" size={14} color="#8B5CF6" />
                      <Text style={styles.quizMetaText}>10 câu</Text>
                    </View>
                    <View style={styles.quizMetaDot} />
                    <View style={styles.quizMetaItem}>
                      <MaterialCommunityIcons name="clock-outline" size={14} color="#8B5CF6" />
                      <Text style={styles.quizMetaText}>4 phút</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.quizArrowButton}>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#8B5CF6" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Mục tiêu tuần & Kiểm tra hàng ngày */}
          <View style={styles.statsRow}>
            {/* Weekly Goal Card */}
            <Surface style={styles.weeklyGoalCard} elevation={1}>
              <View style={styles.weeklyGoalHeader}>
                <Text variant="titleSmall" style={styles.weeklyGoalTitle}>
                  Mục tiêu tuần
                </Text>
                <View style={styles.weekBadge}>
                  <Text style={styles.weekBadgeText}>Tuần 4</Text>
                </View>
              </View>

              <CircularProgress percentage={75} size={80} />

              <Text variant="bodySmall" style={styles.weeklyGoalSubtitle}>
                35/50 Tái chế
              </Text>
            </Surface>

            {/* Daily Check Card */}
            <TouchableOpacity
              style={styles.dailyCheckCard}
              activeOpacity={0.7}
              onPress={() => console.log('Daily check pressed')}
            >
              <View style={styles.dailyCheckTop}>
                <View style={styles.dailyCheckIcon}>
                  <MaterialCommunityIcons
                    name="clipboard-check"
                    size={24}
                    color={colors.accentBlue}
                  />
                </View>
                <View style={styles.chevronButton}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={colors.accentBlue}
                  />
                </View>
              </View>

              <View style={styles.dailyCheckContent}>
                <Text variant="titleSmall" style={styles.dailyCheckTitle}>
                  Kiểm tra{'\n'}hằng ngày
                </Text>
                <Text variant="bodySmall" style={styles.dailyCheckSubtitle}>
                  Nhận thêm xu!
                </Text>

                <View style={styles.dailyProgressContainer}>
                  <View style={styles.dailyProgressBar}>
                    <View style={[styles.dailyProgressFill, { width: '67%' }]} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tiến độ */}
          <View style={styles.section}>
            <SectionHeader
              title="Tiến độ"
              linkText="Xem tất cả"
              onLinkPress={() => console.log('View all progress')}
            />
            <ProgressCard items={progressData} />
          </View>

          {/* Extra padding to prevent bottom nav overlap */}
          <View style={{ height: 100 }} />
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
  gameCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  quizCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  quizLeftSection: {
    marginRight: spacing.md,
  },
  quizIconBox: {
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    width: 64,
    borderWidth: 3,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  quizContent: {
    flex: 1,
  },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
    gap: 4,
  },
  quizBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 0.3,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 6,
  },
  quizMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quizMetaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  quizMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  quizArrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  // Weekly Goal Card
  weeklyGoalCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    flex: 1,
    gap: spacing.sm,
    padding: spacing.base,
  },
  weeklyGoalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  weeklyGoalTitle: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  weekBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  weekBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  weeklyGoalSubtitle: {
    color: colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Daily Check Card
  dailyCheckCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    elevation: 2,
    flex: 1,
    padding: spacing.base,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  dailyCheckTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dailyCheckIcon: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: borderRadius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  chevronButton: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: borderRadius.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  dailyCheckContent: {
    gap: spacing.xs,
  },
  dailyCheckTitle: {
    color: colors.text.primary,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  dailyCheckSubtitle: {
    color: colors.text.secondary,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  dailyProgressContainer: {
    width: '100%',
  },
  dailyProgressBar: {
    backgroundColor: '#E2E8F0',
    borderRadius: borderRadius.base,
    height: 6,
    overflow: 'hidden',
    width: '100%',
  },
  dailyProgressFill: {
    backgroundColor: '#60A5FA',
    borderRadius: borderRadius.base,
    height: '100%',
  },
});
