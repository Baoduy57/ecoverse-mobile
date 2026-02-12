import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
    redeemedAt: '22/12/2025',
  },
  {
    id: '2',
    userId: 'user1',
    rewardId: '6',
    reward: MOCK_REWARDS[3],
    pointsSpent: 2500,
    status: 'APPROVED' as any,
    redeemedAt: '18/12/2025',
  },
  {
    id: '3',
    userId: 'user1',
    rewardId: '2',
    reward: MOCK_REWARDS[1],
    pointsSpent: 300,
    status: 'PARENT_REJECTED' as any,
    redeemedAt: '15/12/2025',
  },
  {
    id: '4',
    userId: 'user1',
    rewardId: '5',
    reward: MOCK_REWARDS[2],
    pointsSpent: 800,
    status: 'USED' as any,
    redeemedAt: '10/12/2025',
  },
] as IRedeemHistory[];

export default function RewardHistoryScreen() {
  const navigation = useNavigation();
  const userPoints = 1250; // Mock - should get from store

  // Animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for decorative icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Decorative Elements */}
      <View style={styles.bgDecorativeTop} />
      <View style={styles.bgDecorativeRight} />
      <View style={styles.bgDecorativeBottom} />

      {/* Floating Icons */}
      <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatAnim1 }] }]}>
        <MaterialCommunityIcons name="leaf" size={100} color="rgba(129, 199, 132, 0.3)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatAnim2 }] }]}>
        <MaterialCommunityIcons name="recycle" size={80} color="rgba(129, 199, 132, 0.3)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon3, { transform: [{ translateY: floatAnim3 }] }]}>
        <MaterialCommunityIcons name="cloud" size={60} color="rgba(144, 202, 249, 0.4)" />
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch sử đổi quà</Text>
          <View style={styles.pointsBadge}>
            <MaterialCommunityIcons name="circle-multiple" size={20} color={colors.accent} />
            <Text style={styles.pointsText}>{userPoints}</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {MOCK_HISTORY.map(item => (
            <RewardHistoryItem
              key={item.id}
              title={item.reward.title}
              image={item.reward.image}
              icon={item.reward.icon}
              iconColor={item.reward.iconColor}
              pointsSpent={item.pointsSpent}
              status={item.status}
              redeemedAt={item.redeemedAt}
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
  // Background decorative elements
  bgDecorativeTop: {
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    height: '40%',
    left: '-10%',
    opacity: 0.6,
    position: 'absolute',
    top: '-10%',
    width: '70%',
  },
  bgDecorativeRight: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 9999,
    height: '50%',
    position: 'absolute',
    right: '-20%',
    top: '40%',
    width: '80%',
  },
  bgDecorativeBottom: {
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    bottom: '-10%',
    height: '40%',
    left: '10%',
    opacity: 0.5,
    position: 'absolute',
    width: '60%',
  },
  // Floating icons
  floatingIcon1: {
    position: 'absolute',
    right: -20,
    top: '15%',
    zIndex: 0,
  },
  floatingIcon2: {
    bottom: '20%',
    left: -30,
    position: 'absolute',
    zIndex: 0,
  },
  floatingIcon3: {
    left: '5%',
    position: 'absolute',
    top: '40%',
    zIndex: 0,
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
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['6xl'],
  },
});
