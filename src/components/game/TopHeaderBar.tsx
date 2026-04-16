import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { borderRadius, colors } from '../../theme';
import Tooltip from '../common/Tooltip';

interface TopHeaderBarProps {
  onBack?: () => void;
  stats: {
    missions: number;
    streak: number;
    ecoPoints: number;
  };
}

export default function TopHeaderBar({ onBack, stats }: TopHeaderBarProps) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text.primary} />
      </TouchableOpacity>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Tooltip content="Điểm sinh thái tích lũy">
          <StatItem icon="star" value={`${stats.ecoPoints} điểm`} color={colors.accent} />
        </Tooltip>
      </View>
    </View>
  );
}

interface StatItemProps {
  icon: string;
  value: number | string;
  color: string;
}

function StatItem({ icon, value, color }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon as any} size={28} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E6ECE7',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF4D7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  statValue: {
    fontSize: 19,
    fontWeight: '700',
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
});
