import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';

interface ConfirmRedeemDialogProps {
  visible: boolean;
  rewardTitle: string;
  pointsCost: number;
  image?: string;
  icon?: string;
  iconColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmRedeemDialog({
  visible,
  rewardTitle,
  pointsCost,
  image,
  icon = 'gift',
  iconColor = colors.primary,
  onConfirm,
  onCancel,
}: ConfirmRedeemDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onCancel}>
        <TouchableOpacity
          style={styles.dialogCard}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onCancel}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MaterialCommunityIcons name="close" size={22} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Reward preview */}
          <View style={styles.rewardPreview}>
            <View style={[styles.imageContainer, { backgroundColor: `${iconColor}14` }]}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={[styles.iconPlaceholder, { backgroundColor: `${iconColor}18` }]}>
                  <MaterialCommunityIcons name={icon as any} size={56} color={iconColor} />
                </View>
              )}
            </View>
            <Text style={styles.rewardTitle} numberOfLines={2}>
              {rewardTitle}
            </Text>
            <View style={styles.costChip}>
              <MaterialCommunityIcons name="star-four-points" size={18} color={colors.accent} />
              <Text style={styles.costText}>{pointsCost.toLocaleString()} xu</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <Text style={styles.title}>Xác nhận đổi quà?</Text>
          <Text style={styles.message}>
            Bạn sẽ trừ <Text style={styles.pointsHighlight}>{pointsCost.toLocaleString()} xu</Text>{' '}
            để đổi quà này. Phụ huynh cần xác nhận trước khi giao quà.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} activeOpacity={0.85}>
              <MaterialCommunityIcons name="check-circle" size={20} color={colors.text.white} />
              <Text style={styles.confirmButtonLabel}>Đồng ý đổi quà</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelButtonLabel}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

interface SuccessDialogProps {
  visible: boolean;
  onClose: () => void;
}

export function SuccessDialog({ visible, onClose }: SuccessDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.dialogCard}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          {/* Success icon */}
          <View style={styles.successIconWrap}>
            <View style={styles.successIconInner}>
              <MaterialCommunityIcons name="check" size={48} color={colors.text.white} />
            </View>
          </View>

          <Text style={styles.title}>Đã gửi yêu cầu!</Text>
          <Text style={styles.message}>
            Yêu cầu đổi quà đã được gửi đến phụ huynh. Bạn vui lòng chờ phụ huynh xác nhận nhé.
          </Text>

          <TouchableOpacity style={styles.singleButton} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.singleButtonLabel}>Đã hiểu</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  dialogCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  // Confirm dialog - reward preview
  rewardPreview: {
    alignItems: 'center',
    width: '100%',
    paddingTop: spacing.sm,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.md,
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
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  costChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 174, 0, 0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 174, 0, 0.25)',
  },
  costText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.xs,
  },
  pointsHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  buttonGroup: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    borderRadius: 16,
    width: '100%',
  },
  confirmButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  cancelButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  // Success dialog
  successIconWrap: {
    marginBottom: spacing.md,
  },
  successIconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.status.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  singleButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  singleButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
});
