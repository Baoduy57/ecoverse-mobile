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
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.divider,
  },
  buttonText: {
    color: colors.text.disabled,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: colors.text.white,
  },
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    elevation: 4,
    gap: spacing.sm,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  iconPlaceholder: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  info: {
    gap: 4,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: colors.text.white,
    fontSize: 13,
    fontWeight: '600',
  },
  points: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  pointsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  stockHint: {
    color: colors.status.warning,
    fontSize: 11,
    marginTop: 2,
  },
  title: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    minHeight: 38,
  },
});
