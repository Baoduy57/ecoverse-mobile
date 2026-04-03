import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../../../theme';
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
            styles.binWrapper,
            highlightedBin === bin.type && styles.binHighlighted,
            { transform: [{ scale: binScaleAnims[index] }] },
          ]}
        >
          <View style={styles.trashCanShape}>
            {/* Lid */}
            <View style={[styles.lid, { backgroundColor: bin.color }]} />

            {/* Body */}
            <View style={[styles.body, { backgroundColor: bin.color }]}>
              {/* Two-tone top overlay to make top half lighter */}
              <View style={styles.twoToneOverlay} />

              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={bin.icon as any} size={32} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Label outside, below the shape */}
          <Text style={[styles.binLabel, { color: bin.color }]}>
            {bin.name.toUpperCase()}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  binHighlighted: {
    transform: [{ translateY: -8 }], // slight pop up when active, scale is handled by anim
  },
  binLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  binWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  binsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
  },
  body: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    height: '80%',
    overflow: 'hidden', // keeps the two-tone overlay inside
    width: '88%', // slightly narrower than lid
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  iconContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  lid: {
    borderRadius: 8,
    elevation: 3,
    height: '14%',
    marginBottom: '2%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trashCanShape: {
    alignItems: 'center',
    aspectRatio: 0.75, // Taller than wide
    justifyContent: 'flex-start',
    width: '100%',
  },
  twoToneOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // lightens the top half
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
