import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import type { IRedeemHistory } from '../../types';

interface ReasonDialogProps {
  visible: boolean;
  historyItem: IRedeemHistory | null;
  onClose: () => void;
}

export default function ReasonDialog({ visible, historyItem, onClose }: ReasonDialogProps) {
  if (!historyItem) return null;

  const isRejected =
    historyItem.status === 'PARENT_REJECTED' || historyItem.status === 'PARTNER_REJECTED';

  const getTitle = () => {
    if (historyItem.status === 'CANCELLED') return 'Đã hủy đổi quà';
    if (isRejected) return 'Yêu cầu bị từ chối';
    return 'Ghi chú giao dịch';
  };

  const getIcon = () => {
    if (historyItem.status === 'CANCELLED') return 'cancel';
    if (isRejected) return 'close-circle';
    return 'information-variant';
  };

  const getIconColor = () => {
    if (historyItem.status === 'CANCELLED') return colors.text.secondary;
    if (isRejected) return colors.status.error;
    return colors.primary;
  };

  const hasParentReason = !!historyItem.reason_parent;
  const hasPartnerReason = !!historyItem.reason_partner;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.dialogCard}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MaterialCommunityIcons name="close" size={22} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Header Icon */}
          <View style={styles.iconWrap}>
            <View style={[styles.iconInner, { backgroundColor: getIconColor() + '1A' }]}>
              <MaterialCommunityIcons name={getIcon()} size={42} color={getIconColor()} />
            </View>
          </View>

          <Text style={styles.title}>{getTitle()}</Text>

          {historyItem.status === 'CANCELLED' && (
            <Text style={styles.message}>Yêu cầu đổi quà đã bị hủy bỏ bởi hệ thống.</Text>
          )}

          {/* Parent Reason */}
          {hasParentReason && (
            <View style={styles.reasonSection}>
              <Text style={styles.reasonLabel}>
                Lý do từ phụ huynh 
                {historyItem.status === 'PARENT_REJECTED' ? ' (Từ chối)' : ''}:
              </Text>
              <View style={styles.reasonBox}>
                <Text style={styles.reasonText}>{historyItem.reason_parent}</Text>
              </View>
            </View>
          )}

          {/* Partner Reason */}
          {hasPartnerReason && (
            <View style={styles.reasonSection}>
              <Text style={styles.reasonLabel}>
                Lý do từ đối tác 
                {historyItem.status === 'PARTNER_REJECTED' ? ' (Từ chối)' : ''}:
              </Text>
              <View style={styles.reasonBox}>
                <Text style={styles.reasonText}>{historyItem.reason_partner}</Text>
              </View>
            </View>
          )}

          {/* Fallback for rejected without reason */}
          {isRejected && !hasParentReason && !hasPartnerReason && (
            <Text style={styles.message}>
              {historyItem.status === 'PARENT_REJECTED' 
                ? 'Phụ huynh đã từ chối yêu cầu đổi quà này nhưng không để lại ghi chú.'
                : 'Đối tác đã từ chối yêu cầu đổi quà này nhưng không để lại ghi chú.'}
            </Text>
          )}

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
  iconWrap: {
    marginBottom: spacing.base,
  },
  iconInner: {
    alignItems: 'center',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  title: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  reasonSection: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  reasonLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  reasonBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  reasonText: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
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
