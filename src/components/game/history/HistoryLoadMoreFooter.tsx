import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../../theme';

interface HistoryLoadMoreFooterProps {
  isLoadingMore: boolean;
  hasMore: boolean;
}

export default function HistoryLoadMoreFooter({
  isLoadingMore,
  hasMore,
}: HistoryLoadMoreFooterProps) {
  if (!isLoadingMore && !hasMore) {
    return (
      <View style={styles.footerWrap}>
        <MaterialCommunityIcons name="party-popper" size={18} color={colors.primary} />
        <Text style={styles.doneText}>Bạn đã xem hết lịch sử rồi nhé!</Text>
      </View>
    );
  }

  if (!isLoadingMore) {
    return (
      <View style={styles.footerWrap}>
        <MaterialCommunityIcons name="gesture-swipe-up" size={18} color={colors.text.secondary} />
        <Text style={styles.hintText}>Keo len de tai them lich su</Text>
      </View>
    );
  }

  return (
    <View style={styles.footerWrap}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.hintText}>Dang tai them...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  doneText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  footerWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.base,
  },
  hintText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
