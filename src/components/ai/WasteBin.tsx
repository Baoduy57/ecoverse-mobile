import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    // Outer plain View handles border/shadow (static, no driver conflict)
    <View
      style={[
        styles.container,
        {
          borderColor: isHighlighted ? wasteType.color : 'transparent',
          borderWidth: 3,
          ...Platform.select({
            ios: {
              shadowColor: wasteType.color,
              shadowOpacity: isHighlighted ? 0.55 : 0.15,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
            },
            android: { elevation: isHighlighted ? 10 : 5 },
          }),
        },
      ]}
    >
      {/* Inner Animated.View handles only native-driver scale */}
      <Animated.View style={[styles.innerScale, { transform: [{ scale: scaleAnim }] }]}>
        {/* Icon area with gradient */}
        <LinearGradient
          colors={[wasteType.color, wasteType.color + 'CC']}
          style={styles.iconArea}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {isHighlighted && <View style={styles.glowPulse} />}
          <MaterialCommunityIcons name={wasteType.icon as any} size={42} color="#FFFFFF" />
        </LinearGradient>

        {/* Label */}
        <View style={[styles.labelArea, { backgroundColor: wasteType.color + '18' }]}>
          <Text style={[styles.binLabel, { color: wasteType.color }]} numberOfLines={2}>
            {wasteType.name}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
  },
  innerScale: {
    width: '100%',
  },
  iconArea: {
    alignItems: 'center',
    height: 82,
    justifyContent: 'center',
    width: '100%',
  },
  glowPulse: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF30',
  },
  labelArea: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 9,
    width: '100%',
  },
  binLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
    lineHeight: 14,
    textAlign: 'center',
  },
});
