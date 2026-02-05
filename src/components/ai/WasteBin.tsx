import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WasteType } from '@/types/wasteClassification';
import { colors } from '@/theme';

interface WasteBinProps {
  wasteType: WasteType;
  isHighlighted?: boolean;
}

export default function WasteBin({ wasteType, isHighlighted }: WasteBinProps) {
  return (
    <View
      style={[
        styles.bin,
        {
          backgroundColor: wasteType.color,
          borderWidth: isHighlighted ? 4 : 0,
          borderColor: isHighlighted ? colors.accent : 'transparent',
          transform: [{ scale: isHighlighted ? 1.12 : 1 }],
        },
      ]}
    >
      <MaterialCommunityIcons name={wasteType.icon as any} size={44} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  bin: {
    alignItems: 'center',
    borderRadius: 16,
    height: 88,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 80,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
