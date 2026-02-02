import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

interface ProgressItemData {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  progress: number;
  value: string;
}

interface ProgressCardProps {
  items: ProgressItemData[];
}

export default function ProgressCard({ items }: ProgressCardProps) {
  return (
    <Surface style={styles.progressCard} elevation={1}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.progressItem}>
          <View style={[styles.progressIconBox, { backgroundColor: item.iconColor + '20' }]}>
            <MaterialCommunityIcons name={item.icon as any} size={24} color={item.iconColor} />
          </View>
          <View style={styles.progressInfo}>
            <Text variant="titleSmall">{item.title}</Text>
            <ProgressBar
              progress={item.progress}
              color={item.iconColor}
              style={styles.progressBar}
            />
          </View>
          <Text variant="titleSmall" style={styles.progressValue}>
            {item.value}
          </Text>
        </View>
      ))}
    </Surface>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    gap: 16,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
    gap: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressValue: {
    fontWeight: 'bold',
    color: colors.text.primary,
    minWidth: 50,
    textAlign: 'right',
  },
});
