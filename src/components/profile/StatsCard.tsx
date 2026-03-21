import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@theme';

interface StatsCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  label: string;
  value: string | number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, iconColor, label, value }) => {
  return (
    <View style={[styles.container, { backgroundColor: iconColor + '10', borderColor: iconColor + '30' }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
      </View>
      <Text variant="labelSmall" style={styles.label}>
        {label}
      </Text>
      <Text variant="titleMedium" style={[styles.value, { color: iconColor }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 20, // Playful rounded corners
    borderWidth: 2,
    elevation: 0, // Flat design with colors
    flex: 1,
    padding: spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 48,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
  },
});
