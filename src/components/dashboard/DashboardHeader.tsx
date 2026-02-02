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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    color: colors.text.secondary,
  },
  username: {
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  badgeText: {
    fontWeight: 'bold',
  },
});
