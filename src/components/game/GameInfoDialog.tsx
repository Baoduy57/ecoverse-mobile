import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';

interface GameInfoDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onClose: () => void;
}

export default function GameInfoDialog({
  visible,
  title,
  message,
  confirmText = 'Đã hiểu',
  onClose,
}: GameInfoDialogProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={event => event.stopPropagation()}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="information-outline" size={26} color={colors.primary} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <Button
            mode="contained"
            onPress={onClose}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {confirmText}
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    borderRadius: borderRadius.full,
    marginTop: spacing.base,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dialog: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 8,
    maxWidth: 360,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    width: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 44,
  },
  message: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
