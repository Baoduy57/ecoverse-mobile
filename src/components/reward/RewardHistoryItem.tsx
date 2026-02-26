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
  isFirst?: boolean;
  isLast?: boolean;
}

export default function RewardHistoryItem({
  title,
  image,
  icon = 'gift',
  iconColor = colors.primary,
  pointsSpent,
  status,
  redeemedAt,
  isFirst,
  isLast,
}: RewardHistoryItemProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'PENDING':
        return {
          text: 'Chờ duyệt',
          color: colors.accent,
          icon: 'clock-outline',
          bg: 'rgba(255, 174, 0, 0.12)',
        };
      case 'PARENT_APPROVED':
      case 'APPROVED':
      case 'DELIVERED':
      case 'USED':
        return {
          text: 'Đã duyệt',
          color: colors.status.success,
          icon: 'check-circle',
          bg: 'rgba(76, 175, 80, 0.12)',
        };
      case 'PARENT_REJECTED':
      case 'CANCELLED':
        return {
          text: 'Từ chối',
          color: colors.status.error,
          icon: 'close-circle',
          bg: 'rgba(244, 67, 54, 0.1)',
        };
      case 'EXPIRED':
        return {
          text: 'Hết hạn',
          color: colors.text.disabled,
          icon: 'alert-circle',
          bg: 'rgba(189, 189, 189, 0.15)',
        };
      default:
        return {
          text: 'Đang xử lý',
          color: colors.text.secondary,
          icon: 'information',
          bg: 'rgba(117, 117, 117, 0.1)',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const isPointsDeducted = ['PARENT_APPROVED', 'APPROVED', 'DELIVERED', 'USED'].includes(status);

  return (
    <View style={[styles.wrapper, isFirst && styles.wrapperFirst, isLast && styles.wrapperLast]}>
      {/* Timeline line */}
      {!isLast && <View style={styles.timelineLine} />}
      <View style={[styles.container, { borderLeftColor: statusInfo.color }]}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={[styles.iconPlaceholder, { backgroundColor: `${iconColor}18` }]}>
              <MaterialCommunityIcons name={icon as any} size={30} color={iconColor} />
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.date}>{redeemedAt}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <MaterialCommunityIcons
              name={statusInfo.icon as any}
              size={14}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
          </View>
        </View>
        {isPointsDeducted && (
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsValue}>-{pointsSpent}</Text>
            <Text style={styles.pointsUnit}>xu</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  wrapperFirst: {
    marginTop: spacing.xs,
  },
  wrapperLast: {
    marginBottom: spacing.lg,
  },
  timelineLine: {
    position: 'absolute',
    left: 23,
    top: 52,
    bottom: -spacing.sm,
    width: 2,
    backgroundColor: colors.divider,
    borderRadius: 1,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
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
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.base,
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.status.error,
  },
  pointsUnit: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
