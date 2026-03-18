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
    alignItems: 'center',
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialogCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 12,
    maxWidth: 340,
    padding: spacing.xl,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    width: '100%',
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    width: 36,
    zIndex: 1,
  },
  // Confirm dialog - reward preview
  rewardPreview: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    width: '100%',
  },
  imageContainer: {
    borderRadius: 20,
    height: 100,
    marginBottom: spacing.md,
    overflow: 'hidden',
    width: 100,
  },
  image: {
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
  iconPlaceholder: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  rewardTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  costChip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 174, 0, 0.12)',
    borderColor: 'rgba(255, 174, 0, 0.25)',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  costText: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginVertical: spacing.md,
    width: '100%',
  },
  title: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
  },
  pointsHighlight: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  buttonGroup: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: '100%',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.base,
    width: '100%',
  },
  confirmButtonLabel: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cancelButtonLabel: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: '600',
  },
  // Success dialog
  successIconWrap: {
    marginBottom: spacing.md,
  },
  successIconInner: {
    alignItems: 'center',
    backgroundColor: colors.status.success,
    borderRadius: 44,
    elevation: 6,
    height: 88,
    justifyContent: 'center',
    shadowColor: colors.status.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    width: 88,
  },
  singleButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.base,
    width: '100%',
  },
  singleButtonLabel: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
