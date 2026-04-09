import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { colors, spacing, borderRadius } from '../../theme';
import { RewardHistoryItem, ReasonDialog } from '../../components/reward';
import { useAuthStore } from '../../store/authStore';
import { useRewardStore } from '../../store/rewardStore';
import type { IRedeemHistory } from '../../types';

export default function RewardHistoryScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { redemptionHistory, fetchRedemptionHistory, isLoading } = useRewardStore();

  const userPoints = user?.points || 0;

  const [selectedItem, setSelectedItem] = useState<IRedeemHistory | null>(null);

  const handlePressItem = useCallback((item: IRedeemHistory) => {
    setSelectedItem(item);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchRedemptionHistory(user.id);
      }
    }, [fetchRedemptionHistory, user?.id])
  );

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonInner}>
              <MaterialCommunityIcons name="chevron-left" size={26} color={colors.text.primary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch sử đổi quà</Text>
          <View style={styles.pointsBadge}>
            <View style={styles.pointsIconWrap}>
              <MaterialCommunityIcons name="star-four-points" size={16} color={colors.accent} />
            </View>
            <Text style={styles.pointsText}>{userPoints}</Text>
          </View>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleRow}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={colors.text.secondary} />
          <Text style={styles.subtitleText}>Các giao dịch đổi quà gần đây</Text>
        </View>

        {/* Content */}
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {redemptionHistory.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: colors.text.secondary }}>Bạn chưa đổi món quà nào.</Text>
              </View>
            ) : (
              redemptionHistory.map((item, index) => (
                <RewardHistoryItem
                  key={item.id}
                  title={item.reward.name}
                  image={item.reward.image_url}
                  pointsSpent={item.pointsSpent}
                  status={item.status}
                  redeemedAt={item.redeemedAt}
                  isFirst={index === 0}
                  isLast={index === redemptionHistory.length - 1}
                  onPress={() => handlePressItem(item)}
                />
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>
      
      <ReasonDialog
        visible={!!selectedItem}
        historyItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backButtonInner: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 2,
    height: 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    width: 40,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  content: {
    paddingBottom: spacing['6xl'],
    paddingHorizontal: spacing.base,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: spacing.sm,
    textAlign: 'center',
  },
  pointsBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 174, 0, 0.25)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pointsIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 174, 0, 0.15)',
    borderRadius: 13,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  pointsText: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  subtitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  subtitleText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
});
