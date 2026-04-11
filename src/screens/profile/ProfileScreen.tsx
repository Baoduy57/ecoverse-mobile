import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { AppStackParamList } from '@navigation/AppNavigator';
import type { HomeTabParamList } from '../../navigation/TabNavigator';
import { useAuthStore } from '@store/authStore';
import { StatsCard, AchievementBadge } from '@/components/profile';
import ScreenBackground from '../../components/common/ScreenBackground';
import { colors, spacing } from '@theme';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, 'Profile'>,
  StackNavigationProp<AppStackParamList>
>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditAvatar');
  };

  // Mock data - sẽ lấy từ store/API sau
  const stats = {
    points: user?.points || 0,
    streak: user?.streak || 0,
    rank: 0,
  };

  const mappedParentName = user?.parentName?.trim() || 'Phu huynh';

  const achievements = [
    { icon: 'recycle', iconColor: '#FFB300', title: 'Siêu nhặt rác', isLocked: false },
    { icon: 'shield-check', iconColor: '#2196F3', title: 'Hiệp sĩ xanh', isLocked: false },
    { icon: 'speedometer', iconColor: '#FF5722', title: 'Tốc độ', isLocked: true },
  ];

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSettings}>
              <MaterialCommunityIcons name="cog-outline" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    user?.avatar
                      ? { uri: user.avatar }
                      : require('../../../assets/images/default-avatar.jpg')
                  }
                  style={styles.avatar}
                />
              </View>
              <View style={styles.onlineBadge}>
                <MaterialCommunityIcons name="star" size={20} color="#FFF" />
              </View>
            </View>

            <Text variant="headlineMedium" style={styles.name}>
              {user?.name || 'Học Sinh'}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Chiến binh xanh • {user?.grade ? `Lớp ${user.grade}` : 'Đang cập nhật'}
            </Text>

            <Button
              mode="contained"
              icon="pencil"
              style={styles.editButton}
              labelStyle={styles.editButtonLabel}
              onPress={handleEditProfile}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <StatsCard
              icon="circle-multiple"
              iconColor={colors.accent}
              label="ECO-POINTS"
              value={stats.points.toLocaleString()}
            />
            <StatsCard
              icon="fire"
              iconColor={colors.secondary}
              label="CHUỖI NGÀY"
              value={stats.streak}
            />
            <StatsCard
              icon="trophy"
              iconColor={colors.accentBlue}
              label="THỨ HẠNG"
              value={`#${stats.rank.toString().padStart(2, '0')}`}
            />
          </View>

          {/* Achievements Section */}
          <View style={styles.achievementsSection}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Thành tựu
              </Text>
              <Text variant="bodySmall" style={styles.achievementCount}>
                8/24
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsList}
            >
              {achievements.map((achievement, index) => (
                <AchievementBadge
                  key={index}
                  icon={achievement.icon as any}
                  iconColor={achievement.iconColor}
                  title={achievement.title}
                  isLocked={achievement.isLocked}
                />
              ))}
            </ScrollView>
          </View>

          {/* Additional Info */}
          <View style={styles.infoSection}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#0284C7" />
            <Text variant="bodyMedium" style={styles.infoText}>
              Da lien ket voi phu huynh! <Text style={styles.infoBold}>{mappedParentName}</Text>
            </Text>
          </View>

          {/* Extra padding to prevent bottom nav overlap */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  achievementCount: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  achievementsList: {
    gap: spacing.sm, // slight increase for circular badges
    paddingHorizontal: spacing.base,
  },
  achievementsSection: {
    marginBottom: spacing.xl,
  },
  avatar: {
    backgroundColor: '#FFE0B2',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    height: 110,
    width: 110,
  },
  avatarContainer: {
    padding: 4,
    borderRadius: 70,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 30, // Pill shape
    elevation: 6,
    minWidth: 220,
    paddingVertical: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  editButtonLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  infoBold: {
    color: '#0C4A6E', // very dark blue
    fontWeight: '900',
  },
  infoSection: {
    alignItems: 'center',
    backgroundColor: '#E0F2FE', // light blue friendly bg
    borderColor: '#BAE6FD',
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  infoText: {
    color: '#0369A1',
    fontSize: 14,
    fontWeight: '700',
  },
  name: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  onlineBadge: {
    alignItems: 'center',
    backgroundColor: '#10B981', // emerald green
    borderColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    bottom: -4,
    elevation: 4,
    height: 38,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    width: 38,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  subtitle: {
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
});
