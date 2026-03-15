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
      {items.map(item => (
        <View key={item.id} style={styles.progressCard}>
          {/* Header row: icon + text + circular indicator */}
          <View style={styles.headerRow}>
            <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
              <MaterialCommunityIcons name={item.icon as any} size={26} color={item.iconColor} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={[styles.value, { color: item.barColor }]}>{item.value}</Text>
            </View>
            {/* Clean circular ring indicator */}
            <View style={[styles.circleRing, { borderColor: item.barColor }]}>
              <View style={[styles.circleInner, { backgroundColor: item.iconBgColor }]}>
                <Text style={[styles.percentageText, { color: item.barColor }]}>
                  {Math.round(item.progress * 100)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Full-width progress bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: item.iconBgColor }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${item.progress * 100}%` as any,
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 3,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
  },
  circleRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarContainer: {
    // no margin top needed; headerRow already has marginBottom
  },
  progressBarBg: {
    height: 7,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
