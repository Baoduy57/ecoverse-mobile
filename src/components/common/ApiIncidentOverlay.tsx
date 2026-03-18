import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '../../theme';
import { ApiIncidentType, useApiStatusStore } from '../../store/apiStatusStore';

type IncidentVisual = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
};

const VISUAL_BY_TYPE: Record<ApiIncidentType, IncidentVisual> = {
  slow_request: {
    icon: 'timer-sand',
    iconColor: colors.status.warning,
  },
  timeout: {
    icon: 'clock-alert-outline',
    iconColor: colors.status.warning,
  },
  maintenance: {
    icon: 'tools',
    iconColor: colors.status.info,
  },
  network: {
    icon: 'wifi-alert',
    iconColor: colors.status.error,
  },
  server: {
    icon: 'server-network-off',
    iconColor: colors.status.error,
  },
};

export default function ApiIncidentOverlay() {
  const incident = useApiStatusStore(state => state.incident);
  const hideIncident = useApiStatusStore(state => state.hideIncident);

  if (!incident) {
    return null;
  }

  const visual = VISUAL_BY_TYPE[incident.type];

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={incident.canDismiss ? hideIncident : undefined}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={visual.icon} size={36} color={visual.iconColor} />
          </View>

          <Text style={styles.title}>{incident.title}</Text>
          <Text style={styles.message}>{incident.message}</Text>

          {incident.canDismiss && (
            <TouchableOpacity style={styles.button} onPress={hideIncident} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Đã hiểu</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    maxWidth: 360,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    width: '100%',
    ...shadows.md,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    height: 72,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 72,
  },
  message: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: 22,
    textAlign: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
