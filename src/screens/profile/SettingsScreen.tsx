import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '@navigation/AppNavigator';
import { useAuthStore } from '@store/authStore';
import { colors, spacing, borderRadius } from '@theme';

type NavigationProp = StackNavigationProp<AppStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuthStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  // Animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHelp = () => {
    // TODO: Navigate to help screen
    console.log('Navigate to Help');
  };

  const handleLogout = async () => {
    await logout();
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text variant="titleLarge" style={styles.headerTitle}>
            Cài đặt
          </Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Settings Items */}
          <View style={styles.settingsContainer}>
            {/* Sound Setting */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="music-note" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text variant="titleSmall" style={styles.settingTitle}>
                    Âm thanh game
                  </Text>
                  <Text variant="bodySmall" style={styles.settingSubtitle}>
                    Nhạc nền & Hiệu ứng
                  </Text>
                </View>
              </View>
              <Switch value={soundEnabled} onValueChange={setSoundEnabled} color={colors.primary} />
            </View>

            {/* Notification Setting */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFE8CC' }]}>
                  <MaterialCommunityIcons name="bell" size={24} color={colors.secondary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text variant="titleSmall" style={styles.settingTitle}>
                    Thông báo
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
                color={colors.primary}
              />
            </View>

            {/* Help & Feedback */}
            <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E1BEE7' }]}>
                  <MaterialCommunityIcons
                    name="help-circle"
                    size={24}
                    color={colors.accentPurple}
                  />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text variant="titleSmall" style={styles.settingTitle}>
                    Trợ giúp & Phản hồi
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text.disabled} />
            </TouchableOpacity>
          </View>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text variant="bodySmall" style={styles.versionText}>
              Phiên bản 1.0.3 (Build 204)
            </Text>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={20} color={colors.status.error} />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  // Background decorative elements
  bgDecorativeTop: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '70%',
    height: '40%',
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    opacity: 0.6,
  },
  bgDecorativeRight: {
    position: 'absolute',
    top: '40%',
    right: '-20%',
    width: '80%',
    height: '50%',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 9999,
  },
  bgDecorativeBottom: {
    position: 'absolute',
    bottom: '-10%',
    left: '10%',
    width: '60%',
    height: '40%',
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    opacity: 0.5,
  },
  // Floating icons
  floatingIcon1: {
    position: 'absolute',
    top: '15%',
    right: -20,
    zIndex: 0,
  },
  floatingIcon2: {
    position: 'absolute',
    bottom: '20%',
    left: -30,
    zIndex: 0,
  },
  floatingIcon3: {
    position: 'absolute',
    top: '40%',
    left: '5%',
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
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  settingsContainer: {
    paddingHorizontal: spacing.base,
    gap: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingSubtitle: {
    color: colors.text.secondary,
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    color: colors.text.secondary,
  },
  logoutContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#FFEBEE',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    color: colors.status.error,
    fontWeight: '600',
    fontSize: 15,
  },
});
