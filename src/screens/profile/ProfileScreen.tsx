import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { AppStackParamList } from '@navigation/AppNavigator';
import type { HomeTabParamList } from '../home/HomeScreen';
import { useAuthStore } from '@store/authStore';
import { StatsCard, AchievementBadge } from '@/components/profile';
import { colors, spacing, borderRadius } from '@theme';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, 'Profile'>,
  StackNavigationProp<AppStackParamList>
>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();

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
    points: user?.points || 1250,
    streak: user?.streak || 15,
    rank: 8,
  };

  const achievements = [
    { icon: 'recycle', iconColor: '#FFB300', title: 'Siêu nhặn rác', isLocked: false },
    { icon: 'shield-check', iconColor: '#2196F3', title: 'Hiệp sĩ xanh', isLocked: false },
    { icon: 'speedometer', iconColor: '#FF5722', title: 'Tốc độ', isLocked: true },
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
            <View style={styles.avatarContainer}>
              <Image
                source={require('../../../assets/images/default-avatar.jpg')}
                style={styles.avatar}
              />
              <View style={styles.onlineBadge}>
                <MaterialCommunityIcons name="check" size={16} color={colors.surface} />
              </View>
            </View>

            <Text variant="headlineMedium" style={styles.name}>
              {user?.name || 'Kiddo'}!
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Chiến binh xanh • {user?.grade ? `Lớp ${user.grade}` : 'Lớp 3'}
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
            <MaterialCommunityIcons name="chess-knight" size={20} color={colors.text.secondary} />
            <Text variant="bodyMedium" style={styles.infoText}>
              Đã liên kết với phụ huynh! <Text style={styles.infoBold}>Bố Nam</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.base,
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#FFE0B2',
    borderRadius: borderRadius.full,
    height: 120,
    width: 120,
  },
  onlineBadge: {
    alignItems: 'center',
    backgroundColor: colors.status.success,
    borderColor: colors.background,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    bottom: 4,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    width: 28,
  },
  name: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    elevation: 5,
    minWidth: 200,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  editButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  achievementsSection: {
    marginBottom: spacing.xl,
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
  achievementCount: {
    color: colors.primary,
    fontWeight: '600',
  },
  achievementsList: {
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
  },
  infoSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  infoText: {
    color: colors.text.secondary,
  },
  infoBold: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
});
