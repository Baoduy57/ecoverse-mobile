import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeTabParamList } from '@/navigation/TabNavigator';

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
  avatar: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  avatarBorder: {
    borderColor: colors.primary,
    borderRadius: 28,
    borderStyle: 'solid',
    borderWidth: 3,
    height: 56,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 56,
  },
  avatarContainer: {
    height: 56,
    position: 'relative',
    width: 56,
  },
  coinBadge: {
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 2,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  coinIcon: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '800',
  },
  coinText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '700',
  },
  greeting: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: spacing.md,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  notificationBadge: {
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 5,
    position: 'absolute',
    right: -2,
    top: -2,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  notificationButton: {
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    borderRadius: 22,
    borderWidth: 2,
    elevation: 2,
    height: 44,
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    width: 44,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 2,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  streakText: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '700',
  },
  username: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
