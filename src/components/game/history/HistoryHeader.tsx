import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { borderRadius, colors, spacing } from '../../../theme';

interface HistoryHeaderProps {
  onBack: () => void;
}

export default function HistoryHeader({ onBack }: HistoryHeaderProps) {
  return (
    <View style={styles.headerWrap}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text.primary} />
      </TouchableOpacity>

      <View style={styles.headerTextWrap}>
        <Text style={styles.title}>Lịch sử đã chơi</Text>
        <Text style={styles.subtitle}>Chỉ hiển thị 5 màn mới nhất, kéo xuống để tải thêm</Text>
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
