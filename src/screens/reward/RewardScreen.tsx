import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { RewardCard, ConfirmRedeemDialog, SuccessDialog } from '../../components/reward';
import type { IReward } from '../../types';
import { useRewardStore } from '../../store/rewardStore';

export default function RewardScreen() {
  const navigation = useNavigation();
  const { rewards, isLoading, fetchRewards, requestRedemption } = useRewardStore();

  const [selectedReward, setSelectedReward] = useState<IReward | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [userPoints] = useState(1250); // MOCK: should come from user profile

  // Fetch data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchRewards();
    }, [fetchRewards])
  );

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

  const handleRedeemPress = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (reward) {
      setSelectedReward(reward);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    try {
      await requestRedemption(selectedReward.id);
      setShowConfirmDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      // Error is handled by store natively, could show a toast here
      setShowConfirmDialog(false);
    }
  };

  const handleCancelRedeem = () => {
    setShowConfirmDialog(false);
    setSelectedReward(null);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    setSelectedReward(null);
  };

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
          <Text style={styles.headerTitle}>Đổi thưởng</Text>
          <View style={styles.headerRight}>
            <View style={styles.pointsBadge}>
              <View style={styles.pointsIconWrap}>
                <MaterialCommunityIcons name="star-four-points" size={18} color={colors.accent} />
              </View>
              <Text style={styles.pointsText}>{userPoints.toLocaleString()} xu</Text>
            </View>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => navigation.navigate('RewardHistory' as never)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="history" size={20} color={colors.primary} />
              <Text style={styles.historyButtonText}>Lịch sử</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <View style={styles.tabPill}>
            <TouchableOpacity style={[styles.tab, styles.tabActive]} activeOpacity={0.8}>
              <MaterialCommunityIcons name="gift-outline" size={18} color={colors.text.white} />
              <Text style={styles.tabTextActive}>Quà tặng</Text>
            </TouchableOpacity>
            <View style={[styles.tab, styles.tabInactive]}>
              <MaterialCommunityIcons
                name="medal-outline"
                size={18}
                color={colors.text.secondary}
              />
              <Text style={styles.tabTextInactive}>Huy hiệu</Text>
            </View>
          </View>
        </View>

        {/* Section label */}
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Quà có thể đổi</Text>
          <Text style={styles.sectionCount}>
            {rewards.filter(r => r.isAvailable && r.stock > 0).length} quà
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={rewards}
              renderItem={({ item }) => (
                <View style={styles.gridItem}>
                  <RewardCard
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    icon={item.icon}
                    iconColor={item.iconColor}
                    pointsCost={item.pointsCost}
                    userPoints={userPoints}
                    stock={item.stock}
                    isAvailable={item.isAvailable}
                    onRedeem={handleRedeemPress}
                  />
                </View>
              )}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>

      {/* Dialogs */}
      {selectedReward && (
        <ConfirmRedeemDialog
          visible={showConfirmDialog}
          rewardTitle={selectedReward.title}
          pointsCost={selectedReward.pointsCost}
          image={selectedReward.image}
          icon={selectedReward.icon}
          iconColor={selectedReward.iconColor}
          onConfirm={handleConfirmRedeem}
          onCancel={handleCancelRedeem}
        />
      )}

      <SuccessDialog visible={showSuccessDialog} onClose={handleCloseSuccess} />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  pointsIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 174, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  tabContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  tabPill: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 4,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.white,
  },
  tabTextInactive: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionCount: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  gridContent: {
    padding: spacing.base,
    paddingBottom: spacing['6xl'],
  },
  gridItem: {
    flex: 1,
    maxWidth: '50%',
    padding: spacing.xs,
  },
});
