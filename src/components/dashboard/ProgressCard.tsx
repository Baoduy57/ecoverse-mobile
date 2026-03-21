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
        <View key={item.id} style={[styles.progressCard, { borderColor: item.barColor }]}>
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
  circleInner: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  circleRing: {
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 3,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  container: {
    gap: spacing.md,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarBg: {
    borderRadius: borderRadius.full,
    height: 7,
    overflow: 'hidden',
  },
  progressBarContainer: {
    // no margin top needed; headerRow already has marginBottom
  },
  progressBarFill: {
    borderRadius: borderRadius.full,
    height: '100%',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 3,
    padding: spacing.base,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
  },
});
