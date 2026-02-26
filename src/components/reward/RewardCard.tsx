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
          <View style={[styles.iconPlaceholder, { backgroundColor: `${iconColor}18` }]}>
            <MaterialCommunityIcons name={icon as any} size={44} color={iconColor} />
          </View>
        )}
        {!inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Hết hàng</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.pointsRow}>
          <MaterialCommunityIcons name="star-four-points" size={15} color={colors.accent} />
          <Text style={styles.points}>{pointsCost.toLocaleString()} xu</Text>
        </View>
        {inStock && stock <= 5 && <Text style={styles.stockHint}>Còn {stock} sản phẩm</Text>}
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
        activeOpacity={0.8}
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
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background,
    position: 'relative',
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
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.white,
  },
  info: {
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    minHeight: 38,
    lineHeight: 18,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  points: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  stockHint: {
    fontSize: 11,
    color: colors.status.warning,
    marginTop: 2,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.divider,
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
