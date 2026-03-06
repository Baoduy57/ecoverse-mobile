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
          {/* Left side with icon and title */}
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
              <MaterialCommunityIcons name={item.icon as any} size={28} color={item.iconColor} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={[styles.value, { color: item.barColor }]}>{item.value}</Text>
            </View>
          </View>

          {/* Right side with circular progress */}
          <View style={styles.rightSection}>
            <View style={styles.circularProgressContainer}>
              <View style={[styles.circularProgressBg, { borderColor: item.iconBgColor }]}>
                <Text style={[styles.percentageText, { color: item.barColor }]}>
                  {Math.round(item.progress * 100)}%
                </Text>
              </View>
              {/* Progress arc indicator */}
              <View
                style={[
                  styles.progressArc,
                  {
                    borderColor: item.barColor,
                    transform: [{ rotate: `${item.progress * 360}deg` }],
                  },
                ]}
              />
            </View>
          </View>

          {/* Full width progress bar at bottom */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: item.iconBgColor }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${item.progress * 100}%`,
                    backgroundColor: item.barColor,
                  },
                ]}
              />
            </View>
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
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  rightSection: {
    position: 'absolute',
    right: spacing.base,
    top: spacing.base,
  },
  circularProgressContainer: {
    width: 60,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressArc: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressBarContainer: {
    marginTop: spacing.xs,
  },
  progressBarBg: {
    height: 6,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
