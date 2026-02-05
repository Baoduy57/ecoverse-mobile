import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@theme';

interface ProgressItemData {
  id: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  title: string;
  progress: number;
  value: string;
  barColor: string;
}

interface ProgressCardProps {
  items: ProgressItemData[];
}

export default function ProgressCard({ items }: ProgressCardProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.progressCard}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
            <MaterialCommunityIcons name={item.icon as any} size={24} color={item.iconColor} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="titleSmall" style={styles.title}>
                {item.title}
              </Text>
              <Text variant="titleSmall" style={[styles.value, { color: item.barColor }]}>
                {item.value}
              </Text>
            </View>

            <ProgressBar
              progress={item.progress}
              color={item.barColor}
              style={styles.progressBar}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  progressBar: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.base,
    height: 8,
  },
  progressCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.base,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  title: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
