import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { colors, spacing, borderRadius } from '../../theme';
import { RewardHistoryItem } from '../../components/reward';
import type { IRedeemHistory, IReward } from '../../types';

// Mock data
const MOCK_REWARDS: IReward[] = [
  {
    id: '1',
    title: 'Vở viết EcoVerse',
    description: 'Vở viết thân thiện môi trường',
    image: '',
    pointsCost: 500,
    category: 'MERCHANDISE' as any,
    stock: 10,
    isAvailable: true,
    icon: 'book-outline',
    iconColor: '#FF9800',
  },
  {
    id: '2',
    title: 'Bộ bút chì màu',
    description: 'Bút chì màu từ gỗ tái chế',
    image: '',
    pointsCost: 300,
    category: 'MERCHANDISE' as any,
    stock: 15,
    isAvailable: true,
    icon: 'palette',
    iconColor: '#E91E63',
  },
  {
    id: '5',
    title: 'Hạt giống thần kỳ',
    description: 'Hạt giống rau củ',
    image: '',
    pointsCost: 800,
    category: 'MERCHANDISE' as any,
    stock: 20,
    isAvailable: true,
    icon: 'seed',
    iconColor: '#4CAF50',
  },
  {
    id: '6',
    title: 'Balo Eco Green',
    description: 'Balo từ vải tái chế',
    image: '',
    pointsCost: 2500,
    category: 'MERCHANDISE' as any,
    stock: 3,
    isAvailable: true,
    icon: 'bag-personal',
    iconColor: '#00BCD4',
  },
];

const MOCK_HISTORY: IRedeemHistory[] = [
  {
    id: '1',
    userId: 'user1',
    rewardId: '1',
    reward: MOCK_REWARDS[0],
    pointsSpent: 500,
    status: 'PENDING' as any,
    redeemedAt: '04/03/2026',
  },
  {
    id: '2',
    userId: 'user1',
    rewardId: '6',
    reward: MOCK_REWARDS[3],
    pointsSpent: 2500,
    status: 'PARENT_APPROVED' as any,
    redeemedAt: '02/03/2026',
  },
  {
    id: '3',
    userId: 'user1',
    rewardId: '2',
    reward: MOCK_REWARDS[1],
    pointsSpent: 300,
    status: 'PARENT_REJECTED' as any,
    redeemedAt: '28/02/2026',
  },
  {
    id: '4',
    userId: 'user1',
    rewardId: '5',
    reward: MOCK_REWARDS[2],
    pointsSpent: 800,
    status: 'DELIVERED' as any,
    redeemedAt: '25/02/2026',
  },
  {
    id: '5',
    userId: 'user1',
    rewardId: '1',
    reward: MOCK_REWARDS[0],
    pointsSpent: 500,
    status: 'USED' as any,
    redeemedAt: '20/02/2026',
  },
] as IRedeemHistory[];

export default function RewardHistoryScreen() {
  const navigation = useNavigation();
  const userPoints = 1250; // Mock - should get from store

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
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {MOCK_HISTORY.map((item, index) => (
            <RewardHistoryItem
              key={item.id}
              title={item.reward.title}
              image={item.reward.image}
              icon={item.reward.icon}
              iconColor={item.reward.iconColor}
              pointsSpent={item.pointsSpent}
              status={item.status}
              redeemedAt={item.redeemedAt}
              isFirst={index === 0}
              isLast={index === MOCK_HISTORY.length - 1}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 174, 0, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pointsIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 174, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  subtitleText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['6xl'],
  },
});
