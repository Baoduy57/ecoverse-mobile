import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
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
          style={styles.container}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          {/* Image/Icon */}
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={[styles.iconPlaceholder, { backgroundColor: `${iconColor}20` }]}>
                <MaterialCommunityIcons name={icon as any} size={64} color={iconColor} />
              </View>
            )}
          </View>

          {/* Content */}
          <Text style={styles.title}>Xác nhận đổi quà?</Text>
          <Text style={styles.message}>
            Bạn có chắc chắn muốn dùng <Text style={styles.points}>{pointsCost} xu</Text> để đổi món
            quà này không?
          </Text>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <Button
              mode="contained"
              onPress={onConfirm}
              style={styles.confirmButton}
              labelStyle={styles.confirmButtonLabel}
            >
              Đồng ý
            </Button>
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonLabel}
              textColor={colors.text.secondary}
            >
              Hủy
            </Button>
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
          style={styles.container}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          {/* Avatar with Badge */}
          <View style={styles.successImageContainer}>
            <Image
              source={require('../../../assets/images/default-avatar.jpg')}
              style={styles.successAvatar}
            />
            <View style={styles.badge}>
              <MaterialCommunityIcons name="check" size={20} color={colors.text.white} />
            </View>
          </View>

          {/* Content */}
          <Text style={styles.title}>Đã gửi yêu cầu!</Text>
          <Text style={styles.message}>
            Yêu cầu của bạn đã được gửi đến phụ huynh để phê duyệt. Hãy kiên nhẫn chờ một chút nhé!
          </Text>

          {/* Button */}
          <Button
            mode="contained"
            onPress={onClose}
            style={styles.singleButton}
            labelStyle={styles.confirmButtonLabel}
          >
            Đã hiểu
          </Button>
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
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: spacing.md,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
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
  successImageContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  successAvatar: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: '#FFE0B2',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  points: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  buttonGroup: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
  },
  confirmButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
  },
  cancelButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  singleButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    marginTop: spacing.sm,
  },
});
