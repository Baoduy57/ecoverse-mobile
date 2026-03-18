import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, typography } from '../../theme';
import { useApiStatusStore } from '../../store/apiStatusStore';

export default function DevApiTestScreen() {
  const insets = useSafeAreaInsets();
  const apiStatusStore = useApiStatusStore();

  const testCases = [
    {
      label: 'Trigger Slow Request (Chậm)',
      action: () => apiStatusStore.showSlowRequest(),
      color: colors.status.warning,
    },
    {
      label: 'Trigger Timeout (Quá tải)',
      action: () => apiStatusStore.showTimeout(),
      color: colors.status.warning,
    },
    {
      label: 'Trigger Maintenance (503)',
      action: () => apiStatusStore.showMaintenance(),
      color: colors.status.info,
    },
    {
      label: 'Trigger Network Error (Mất mạng)',
      action: () => apiStatusStore.showNetworkError(),
      color: colors.status.error,
    },
    {
      label: 'Trigger Server Error (5xx)',
      action: () => apiStatusStore.showServerError(),
      color: colors.status.error,
    },
    {
      label: 'Clear Incident',
      action: () => apiStatusStore.hideIncident(),
      color: colors.primary,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Dev API Test</Text>
        <Text style={styles.subtitle}>Test API Incident Overlay</Text>
      </View>

      <View style={styles.section}>
        {testCases.map((testCase, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { borderLeftColor: testCase.color }]}
            onPress={testCase.action}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{testCase.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Incident</Text>
        {apiStatusStore.incident ? (
          <View style={styles.incidentInfo}>
            <Text style={styles.incidentLabel}>Type: {apiStatusStore.incident.type}</Text>
            <Text style={styles.incidentLabel}>Title: {apiStatusStore.incident.title}</Text>
            <Text style={styles.incidentLabel}>Message: {apiStatusStore.incident.message}</Text>
            <Text style={styles.incidentLabel}>
              Updated: {new Date(apiStatusStore.incident.updatedAt).toLocaleTimeString()}
            </Text>
          </View>
        ) : (
          <Text style={styles.incidentLabel}>No incident</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instruction</Text>
        <Text style={styles.instruction}>1. Bấm các nút trên để simulate loại lỗi API</Text>
        <Text style={styles.instruction}>
          2. Nhìn overlay hiện với biểu tượng + message tương ứng
        </Text>
        <Text style={styles.instruction}>3. Bấm nút "Đã hiểu" trong overlay để đóng</Text>
        <Text style={styles.instruction}>
          4. Kiểm tra logic ưu tiên: Maintenance {'>'} Server {'>'} Timeout {'>'} Network {'>'} Slow
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: spacing.base,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    marginTop: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    marginTop: spacing.sm,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderLeftColor: colors.primary,
    borderLeftWidth: 4,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    marginBottom: spacing.base,
    marginLeft: 0,
    paddingVertical: spacing.lg,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.base,
  },
  incidentInfo: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.base,
  },
  incidentLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontFamily: 'Courier New',
    marginBottom: spacing.sm,
  },
  instruction: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
});
