import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { DashboardHeader, GameCard, ProgressCard, SectionHeader } from '../../components/dashboard';
import { colors } from '../../theme';

type DashboardNavigationProp = StackNavigationProp<AppStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();
  // Data cho Progress Card
  const progressData = [
    {
      id: '1',
      icon: 'book-open-variant',
      iconColor: colors.accentBlue,
      title: 'Bài học',
      progress: 0.8,
      value: '80%',
    },
    {
      id: '2',
      icon: 'flag-checkered',
      iconColor: colors.primaryLight,
      title: 'Mục tiêu',
      progress: 0.8,
      value: '12/15',
    },
    {
      id: '3',
      icon: 'trophy',
      iconColor: colors.secondary,
      title: 'Thử thách',
      progress: 0.76,
      value: '460 XP',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Component */}
        <DashboardHeader
          userName="Kiddo!"
          avatarSource={require('../../../assets/images/default-avatar.jpg')}
          streakCount={5}
          coinCount={1250}
          onNotificationPress={() => console.log('Notification pressed')}
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
          />
          <GameCard
            title={'Công cụ\nAI'}
            icon="robot"
            buttonText="Quét"
            buttonIcon="camera"
            backgroundColor={colors.accentBlue}
            onPress={() => navigation.navigate('AIScanner')}
          />
        </View>

        {/* Bài tập kiểm tra */}
        <View style={styles.section}>
          <SectionHeader
            title="Bài tập kiểm tra"
            linkText="Xem tất cả"
            onLinkPress={() => console.log('View all quizzes')}
          />

          <Surface style={styles.quizCard} elevation={1}>
            <View style={styles.quizIconBox}>
              <MaterialCommunityIcons
                name="clipboard-check"
                size={24}
                color={colors.accentPurple}
              />
            </View>
            <View style={styles.quizContent}>
              <Text variant="labelSmall" style={styles.quizLabel}>
                Quiz tuần
              </Text>
              <Text variant="titleSmall" style={styles.quizTitle}>
                Kiểm thức cơ bản
              </Text>
              <Text variant="bodySmall" style={styles.quizMeta}>
                10 câu hỏi • 4 phút
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text.disabled} />
          </Surface>
        </View>

        {/* Mục tiêu tuần & Kiểm tra hàng ngày */}
        <View style={styles.statsRow}>
          <Surface style={styles.statCard} elevation={1}>
            <View style={styles.statHeader}>
              <Text variant="titleSmall" style={styles.statTitle}>
                Mục tiêu{'\n'}tuần
              </Text>
              <Text style={styles.statBadge}>Tuần</Text>
            </View>
            <View style={styles.circularProgress}>
              <Text variant="headlineLarge" style={styles.progressText}>
                75%
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.statSubtitle}>
              35/50 Tài chính
            </Text>
          </Surface>

          <Surface style={styles.statCard} elevation={1}>
            <View style={styles.checkInCard}>
              <MaterialCommunityIcons name="calendar-check" size={32} color={colors.accentBlue} />
              <Text variant="titleSmall" style={styles.checkInTitle}>
                Kiểm tra{'\n'}hàng ngày
              </Text>
              <Text variant="bodySmall" style={styles.checkInSubtitle}>
                Về 15 Thận trời
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text.disabled} />
          </Surface>
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

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gameCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    gap: 12,
  },
  quizIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.accentPurple + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizContent: {
    flex: 1,
  },
  quizLabel: {
    color: colors.accentPurple,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizTitle: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizMeta: {
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statTitle: {
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statBadge: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  statSubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  checkInCard: {
    alignItems: 'center',
    marginBottom: 8,
  },
  checkInTitle: {
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  checkInSubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
