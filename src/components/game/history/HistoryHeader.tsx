import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { borderRadius, colors, spacing } from '../../../theme';

interface HistoryHeaderProps {
  onBack: () => void;
  title?: string;
}

export default function HistoryHeader({ onBack, title }: HistoryHeaderProps) {
  return (
    <View style={styles.headerWrap}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text.primary} />
      </TouchableOpacity>

      <View style={styles.headerTextWrap}>
        <Text style={styles.title}>{title ?? 'Lịch sử đã chơi'}</Text>
        <Text style={styles.subtitle}>Kéo xuống để tải thêm, nhấn "Chơi lại" để replay</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#DDE9DF',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  subtitle: {
    color: '#5E6F63',
    fontSize: 13,
    marginTop: 2,
  },
  title: {
    color: colors.text.primary,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 36,
  },
});
