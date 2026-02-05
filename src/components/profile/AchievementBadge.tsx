import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@theme';

interface AchievementBadgeProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  title: string;
  isLocked?: boolean;
  onPress?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  iconColor,
  title,
  isLocked = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      <View
        style={[styles.badge, { backgroundColor: isLocked ? colors.text.disabled : iconColor }]}
      >
        <MaterialCommunityIcons name={isLocked ? 'lock' : icon} size={32} color={colors.surface} />
      </View>
      <Text
        variant="labelSmall"
        style={[styles.title, isLocked && styles.lockedTitle]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: borderRadius.md,
    elevation: 3,
    height: 64,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 64,
  },
  container: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    width: 80,
  },
  lockedTitle: {
    color: colors.text.disabled,
  },
  title: {
    color: colors.text.primary,
    textAlign: 'center',
  },
});
