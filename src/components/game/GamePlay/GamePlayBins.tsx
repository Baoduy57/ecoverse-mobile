import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../../../theme';
import type { IWasteBin } from '../../../types';

interface GamePlayBinsProps {
  bins: IWasteBin[];
  highlightedBin: string | null;
  binScaleAnims: Animated.Value[];
  onBinLayout?: (
    binCode: string,
    layout: { x: number; y: number; width: number; height: number }
  ) => void;
}

const BIN_ICON_BY_CODE: Record<string, string> = {
  PLASTIC: 'bottle-soda-outline',
  PAPER: 'file-document-outline',
  ORGANIC: 'leaf',
  OTHERS: 'delete',
};

const HEX_COLOR_REGEX = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

const getBinColor = (bin: IWasteBin) => {
  if (HEX_COLOR_REGEX.test(bin.color_hex || '')) {
    return bin.color_hex;
  }

  if (HEX_COLOR_REGEX.test(bin.description || '')) {
    return bin.description;
  }

  return '#9E9E9E';
};

export default function GamePlayBins({
  bins,
  highlightedBin,
  binScaleAnims,
  onBinLayout,
}: GamePlayBinsProps) {
  const binRefs = useRef<Record<string, any>>({});

  return (
    <View style={styles.binsContainer}>
      {bins.map((bin, index) => {
        const isHighlighted = highlightedBin === bin.code;
        const hasIconUrl = /^https?:\/\//i.test(bin.icon_url || '');
        const binColor = getBinColor(bin);

        return (
          <Animated.View
            key={bin.code}
            ref={ref => {
              binRefs.current[bin.code] = ref;
            }}
            onLayout={event => {
              if (!onBinLayout || !binRefs.current[bin.code]) {
                return;
              }

              binRefs.current[bin.code]?.measureInWindow(
                (x: number, y: number, width: number, height: number) => {
                  onBinLayout(bin.code, { x, y, width, height });
                }
              );
            }}
            style={[
              styles.binWrapper,
              isHighlighted && styles.binHighlighted,
              {
                transform: [
                  { translateY: isHighlighted ? -8 : 0 },
                  { scale: binScaleAnims[index] },
                ],
              },
            ]}
          >
            <View style={styles.trashCanShape}>
              {/* Lid */}
              <View style={[styles.lid, { backgroundColor: binColor }]} />

              {/* Body */}
              <View style={[styles.body, { backgroundColor: binColor }]}>
                {/* Two-tone top overlay to make top half lighter */}
                <View style={styles.twoToneOverlay} />

                <View style={styles.iconContainer}>
                  {hasIconUrl ? (
                    <Image
                      source={{ uri: bin.icon_url }}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={(BIN_ICON_BY_CODE[bin.code] || 'delete') as any}
                      size={32}
                      color="#FFFFFF"
                    />
                  )}
                </View>
              </View>
            </View>

            {/* Label outside, below the shape */}
            <Text style={[styles.binLabel, { color: binColor }]}>
              {bin.display_name.toUpperCase()}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  binHighlighted: {
    opacity: 1,
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
  iconImage: {
    height: 32,
    width: 32,
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
