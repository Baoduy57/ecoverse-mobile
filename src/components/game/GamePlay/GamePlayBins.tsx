import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../../theme';
import { BINS } from '../../../data/dragDropGameData';
import type { WasteType } from '../../../data/dragDropGameData';

interface GamePlayBinsProps {
  highlightedBin: WasteType | null;
  binScaleAnims: Animated.Value[];
}

export default function GamePlayBins({ highlightedBin, binScaleAnims }: GamePlayBinsProps) {
  return (
    <View style={styles.binsContainer}>
      {BINS.map((bin, index) => (
        <Animated.View
          key={bin.type}
          style={[
            styles.bin,
            highlightedBin === bin.type && styles.binHighlighted,
            {
              backgroundColor: bin.bgColor,
              borderColor: bin.color,
              transform: [{ scale: binScaleAnims[index] }],
            },
          ]}
        >
          <View style={[styles.binIconWrap, { backgroundColor: bin.color }]}>
            <MaterialCommunityIcons name={bin.icon as any} size={32} color={colors.text.white} />
          </View>
          <Text style={[styles.binName, { color: bin.color }]}>{bin.name}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bin: {
    alignItems: 'center',
    aspectRatio: 0.8,
    borderRadius: 20,
    borderWidth: 3,
    elevation: 3,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  binHighlighted: {
    borderWidth: 5,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  binIconWrap: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 56,
  },
  binName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  binsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
});
