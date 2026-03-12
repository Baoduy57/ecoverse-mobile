import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeTabParamList } from '@/screens/home/HomeScreen';

interface DashboardHeaderProps {
  userName: string;
  avatarSource: any;
  streakCount: number;
  coinCount: number;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export default function DashboardHeader({
  userName,
  avatarSource,
  streakCount,
  coinCount,
  notificationCount = 0,
  onNotificationPress,
}: DashboardHeaderProps) {
  const navigation = useNavigation<NavigationProp<HomeTabParamList>>();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatarContainer}>
            <Image source={avatarSource} style={styles.avatar} />
            <View style={styles.avatarBorder} />
          </View>
        </TouchableOpacity>

        <View>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.username}>{userName}</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.streakBadge}>
          <MaterialCommunityIcons name="fire" size={18} color="#F97316" />
          <Text style={styles.streakText}>{streakCount}</Text>
        </View>
        <View style={styles.coinBadge}>
          <Text style={styles.coinIcon}>$</Text>
          <Text style={styles.coinText}>{coinCount.toLocaleString('de-DE')}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="bell" size={24} color={colors.primary} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  greeting: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 2,
    borderColor: '#FFEDD5',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EA580C',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  coinIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FBBF24',
  },
  coinText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
