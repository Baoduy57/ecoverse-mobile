import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, InteractionManager } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import {
  DashboardHeader,
  GameCard,
  SectionHeader,
  CircularProgress,
} from '../../components/dashboard';
import ScreenBackground from '../../components/common/ScreenBackground';
import { ScheduledExamCard } from '../../components/exam';
import { colors, spacing, borderRadius } from '@theme';
import { getUnreadCount } from '../../data/notificationData';
import { MOCK_SCHEDULED_EXAMS } from '../../data/examData';
import { useAuthStore } from '../../store/authStore';

type DashboardNavigationProp = StackNavigationProp<AppStackParamList>;

// ─── Statistics Card component ──────────────────────────────────────────────

type StatCardProps = {
  icon: string;
  iconColor: string;
  gradientColors: [string, string];
  value: string | number;
  label: string;
};

function StatCard({ icon, iconColor, gradientColors, value, label }: StatCardProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={statStyles.card}
    >
      <View style={statStyles.glowDot} />
      <View style={[statStyles.iconBox, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
        <MaterialCommunityIcons name={icon as any} size={26} color={colors.text.white} />
      </View>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </LinearGradient>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user, refreshCurrentUser } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (user?.id) {
          refreshCurrentUser(true);
        }
      });
      return () => task.cancel();
    }, [refreshCurrentUser, user?.id])
  );

  const stats = user?.statistics;

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <DashboardHeader
            userName={user?.name || 'Học sinh'}
            avatarSource={
              user?.avatar ? { uri: user.avatar } : require('../../../assets/images/avatar.jpg')
            }
            coinCount={user?.points || 0}
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
              onPress={() =>
                navigation.navigate('Home', {
                  screen: 'Game',
                })
              }
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

          {/* Kiểm tra định kỳ */}
          <View style={styles.section}>
            <SectionHeader
              title="Kiểm tra định kỳ"
              onLinkPress={() => navigation.navigate('ScheduledExam')}
            />
            <ScheduledExamCard
              exam={MOCK_SCHEDULED_EXAMS[0] ?? null}
              onPress={() => navigation.navigate('ScheduledExam')}
            />
          </View>

          {/* Bài tập kiểm tra */}
          <View style={styles.section}>
            <SectionHeader
              title="Bài tập kiểm tra"
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
            <View style={styles.weeklyGoalCard}>
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
            </View>

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

          {/* ── Thống kê học tập ── */}
          <View style={styles.section}>
            <SectionHeader title="Thống kê học tập" />
            <View style={styles.statsGrid}>
              <View style={styles.statsRow2}>
                <StatCard
                  icon="gamepad-variant"
                  iconColor="#EF5350"
                  gradientColors={['#EF5350', '#C62828']}
                  value={stats?.total_games_played ?? 0}
                  label={'Tổng game đã chơi'}
                />
                <StatCard
                  icon="bullseye-arrow"
                  iconColor="#2196F3"
                  gradientColors={['#29B6F6', '#0277BD']}
                  value={`${stats?.total_average_accuracy ?? 0}%`}
                  label={'Độ chính xác TB'}
                />
              </View>
              <View style={styles.statsRow2}>
                <StatCard
                  icon="clipboard-check"
                  iconColor="#8B5CF6"
                  gradientColors={['#AB47BC', '#7B1FA2']}
                  value={stats?.total_quizzes_completed ?? 0}
                  label={'Bài kiểm tra xong'}
                />
                <StatCard
                  icon="trophy"
                  iconColor="#F59E0B"
                  gradientColors={['#FFCA28', '#F57F17']}
                  value={stats?.total_achievements_unlocked ?? 0}
                  label={'Thành tích'}
                />
              </View>
            </View>
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
  // ── Quiz Card ──
  quizCard: {
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderColor: '#8B5CF6',
    borderRadius: 24,
    borderWidth: 3,
    flexDirection: 'row',
    padding: spacing.base,
    elevation: 0,
  },
  quizLeftSection: {
    marginRight: spacing.md,
  },
  quizIconBox: {
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 16,
    borderWidth: 3,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  quizContent: {
    flex: 1,
  },
  quizBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quizBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  quizTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  quizMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  quizMetaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  quizMetaText: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: '600',
  },
  quizMetaDot: {
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  quizArrowButton: {
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: spacing.sm,
    width: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  // ── Weekly Goal Card ──
  weeklyGoalCard: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderRadius: 24,
    borderWidth: 3,
    elevation: 0,
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
  // ── Daily Check Card ──
  dailyCheckCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderRadius: 24,
    borderWidth: 3,
    elevation: 0,
    flex: 1,
    padding: spacing.base,
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
    backgroundColor: '#BFDBFE',
    borderRadius: 10,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  dailyProgressFill: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    height: '100%',
  },
  // stats 2x2 grid
  statsGrid: {
    gap: 10,
  },
  statsRow2: {
    flexDirection: 'row',
    gap: 10,
  },
});
const statStyles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 20,
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    gap: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  glowDot: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 60,
    height: 90,
    position: 'absolute',
    right: -20,
    top: -25,
    width: 90,
  },
  iconBox: {
    padding: 10,
    borderRadius: 14,
    marginBottom: 2,
  },
  value: {
    color: colors.text.white,
    fontSize: 26,
    fontWeight: '900',
  },
  label: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
