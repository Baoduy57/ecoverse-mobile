import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';

interface RewardCardProps {
  id: string;
  title: string;
  image?: string;
  icon?: string;
  iconColor?: string;
  pointsCost: number;
  userPoints: number;
  stock: number;
  isAvailable: boolean;
  onRedeem: (id: string) => void;
}

export default function RewardCard({
  id,
  title,
  image,
  icon = 'gift',
  iconColor = colors.primary,
  pointsCost,
  userPoints,
  stock,
  isAvailable,
  onRedeem,
}: RewardCardProps) {
  const canAfford = userPoints >= pointsCost;
  const inStock = stock > 0 && isAvailable;
  const canRedeem = canAfford && inStock;

  const getButtonState = () => {
    if (!inStock) return { text: 'Hết hàng', disabled: true, color: colors.text.disabled };
    if (!canAfford) return { text: 'Chưa đủ xu', disabled: true, color: colors.text.disabled };
    return { text: 'Đổi', disabled: false, color: colors.primary };
  };

  const buttonState = getButtonState();

  return (
    <View style={styles.container}>
      {/* Image/Icon */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.iconPlaceholder, { backgroundColor: `${iconColor}20` }]}>
            <MaterialCommunityIcons name={icon as any} size={48} color={iconColor} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.pointsRow}>
          <MaterialCommunityIcons name="circle-multiple" size={16} color={colors.accent} />
          <Text style={styles.points}>{pointsCost} xu</Text>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[
          styles.button,
          canRedeem && styles.buttonActive,
          !canRedeem && styles.buttonDisabled,
        ]}
        onPress={() => onRedeem(id)}
        disabled={buttonState.disabled}
      >
        <Text style={[styles.buttonText, canRedeem && styles.buttonTextActive]}>
          {buttonState.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    minHeight: 36,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  points: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.background,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.disabled,
  },
  buttonTextActive: {
    color: colors.text.white,
  },
});
