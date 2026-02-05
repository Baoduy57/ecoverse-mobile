import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface DashboardHeaderProps {
  userName: string;
  avatarSource: any;
  streakCount: number;
  coinCount: number;
  onNotificationPress?: () => void;
}

export default function DashboardHeader({
  userName,
  avatarSource,
  streakCount,
  coinCount,
  onNotificationPress,
}: DashboardHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image source={avatarSource} style={styles.avatar} />
        <View>
          <Text variant="labelSmall" style={styles.greeting}>
            Xin chào,
          </Text>
          <Text variant="titleLarge" style={styles.username}>
            {userName}
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <Surface style={styles.badge} elevation={1}>
          <MaterialCommunityIcons name="fire" size={16} color={colors.secondary} />
          <Text variant="labelSmall" style={styles.badgeText}>
            {streakCount}
          </Text>
        </Surface>
        <Surface style={styles.badge} elevation={1}>
          <MaterialCommunityIcons name="currency-usd" size={16} color={colors.accent} />
          <Text variant="labelMedium" style={styles.badgeText}>
            {coinCount.toLocaleString()}
          </Text>
        </Surface>
        <MaterialCommunityIcons
          name="bell"
          size={24}
          color={colors.text.secondary}
          onPress={onNotificationPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontWeight: 'bold',
  },
  greeting: {
    color: colors.text.secondary,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  username: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
});
