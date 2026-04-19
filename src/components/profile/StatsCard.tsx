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
    <View style={[styles.container, { backgroundColor: iconColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
        <MaterialCommunityIcons name={icon} size={28} color="#FFFFFF" />
      </View>
      <Text variant="labelSmall" style={styles.label}>
        {label}
      </Text>
      <Text variant="titleMedium" style={styles.value}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24, // Playful rounded corners
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
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
});
