import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WasteType } from '@/types/wasteClassification';

interface WasteBinProps {
  wasteType: WasteType;
  isHighlighted?: boolean;
}

export default function WasteBin({ wasteType, isHighlighted }: WasteBinProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isHighlighted ? 1.15 : 1,
      useNativeDriver: true,
      tension: 160,
      friction: 8,
    }).start();
  }, [isHighlighted]);

  return (
    <Animated.View
      style={[
        styles.binWrapper,
        { transform: [{ translateY: isHighlighted ? -8 : 0 }, { scale: scaleAnim }] },
      ]}
    >
      <View style={styles.trashCanShape}>
        {/* Lid */}
        <View style={[styles.lid, { backgroundColor: wasteType.color }]} />

        {/* Body */}
        <View style={[styles.body, { backgroundColor: wasteType.color }]}>
          {/* Two-tone top overlay to make top half lighter */}
          <View style={styles.twoToneOverlay} />

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={wasteType.icon as any} size={30} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Label outside, below the shape */}
      <Text style={[styles.binLabel, { color: wasteType.color }]} numberOfLines={2}>
        {wasteType.name.toUpperCase()}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  binLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 12,
  },
  binWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  body: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    height: '80%',
    overflow: 'hidden', 
    width: '88%',
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
