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
        style={[
          styles.badge,
          isLocked
            ? styles.lockedBadge
            : {
                backgroundColor: iconColor,
                shadowColor: iconColor,
              },
        ]}
      >
        <MaterialCommunityIcons
          name={isLocked ? 'lock' : icon}
          size={isLocked ? 28 : 34}
          color={isLocked ? '#A0AEC0' : colors.surface}
        />
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
    borderRadius: 35, // Full circle
    elevation: 6,
    height: 70,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 70,
  },
  container: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    width: 84, // Slightly wider for bigger badges
  },
  lockedBadge: {
    backgroundColor: '#F7FAFC', // Very light gray bg
    borderColor: '#CBD5E0', // Medium border
    borderStyle: 'dashed',
    borderWidth: 2,
    elevation: 0,
    shadowOpacity: 0,
  },
  lockedTitle: {
    color: '#A0AEC0',
    fontWeight: '600',
  },
  title: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
