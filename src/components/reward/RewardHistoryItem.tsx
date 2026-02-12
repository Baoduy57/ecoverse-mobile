import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import type { RedeemStatus } from '../../types';

interface RewardHistoryItemProps {
  title: string;
  image?: string;
  icon?: string;
  iconColor?: string;
  pointsSpent: number;
  status: RedeemStatus;
  redeemedAt: string;
}

export default function RewardHistoryItem({
  title,
  image,
  icon = 'gift',
  iconColor = colors.primary,
  pointsSpent,
  status,
  redeemedAt,
}: RewardHistoryItemProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'PENDING':
        return { text: 'Chờ phụ huynh duyệt', color: colors.accent, icon: 'clock-outline' };
      case 'PARENT_APPROVED':
      case 'APPROVED':
      case 'DELIVERED':
      case 'USED':
        return { text: 'Đã duyệt', color: colors.status.success, icon: 'check-circle' };
      case 'PARENT_REJECTED':
      case 'CANCELLED':
        return { text: 'Từ chối', color: colors.status.error, icon: 'close-circle' };
      case 'EXPIRED':
        return { text: 'Hết hạn', color: colors.text.disabled, icon: 'alert-circle' };
      default:
        return { text: 'Đang xử lý', color: colors.text.secondary, icon: 'information' };
    }
  };

  const statusInfo = getStatusInfo();

  // Chỉ hiển thị số xu bị trừ khi đã được duyệt
  const isPointsDeducted = ['PARENT_APPROVED', 'APPROVED', 'DELIVERED', 'USED'].includes(status);

  return (
    <View style={styles.container}>
      {/* Image/Icon */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.iconPlaceholder, { backgroundColor: `${iconColor}20` }]}>
            <MaterialCommunityIcons name={icon as any} size={28} color={iconColor} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.date}>{redeemedAt}</Text>
        {/* Status */}
        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name={statusInfo.icon as any}
            size={14}
            color={statusInfo.color}
          />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
        </View>
      </View>

      {/* Points - Only show when points are deducted */}
      {isPointsDeducted && (
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>-{pointsSpent} xu</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
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
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  date: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.status.error,
  },
});
