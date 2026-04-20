import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
  Linking,
} from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '@navigation/AppNavigator';
import { useAuthStore } from '@store/authStore';
import { useSettingsStore, BG_TRACKS } from '@store/settingsStore';
import { audioService } from '@services/audioService';
import ScreenBackground from '../../../components/common/ScreenBackground';
import { colors, spacing, borderRadius } from '@theme';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NavigationProp = StackNavigationProp<AppStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuthStore();
  const {
    bgMusicEnabled,
    sfxInteractionEnabled,
    sfxFeedbackEnabled,
    vibrationEnabled,
    currentBgTrack,
    setBgMusic,
    setSfxInteraction,
    setSfxFeedback,
    setVibration,
    setBgTrack,
    loadSettings,
  } = useSettingsStore();

  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [soundExpanded, setSoundExpanded] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Master switch: any category enabled = master on
  const masterSoundEnabled = bgMusicEnabled || sfxInteractionEnabled || sfxFeedbackEnabled;

  const currentTrackIndex = BG_TRACKS.findIndex(t => t.key === currentBgTrack);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const toggleSoundExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSoundExpanded(v => !v);
  };

  const handleMasterSound = (value: boolean) => {
    setBgMusic(value);
    setSfxInteraction(value);
    setSfxFeedback(value);
    audioService.setBgMusicEnabled(value, currentBgTrack);
    audioService.setInteractionEnabled(value);
    audioService.setFeedbackEnabled(value);
  };

  const handleBgMusic = async (value: boolean) => {
    setBgMusic(value);
    await audioService.setBgMusicEnabled(value, currentBgTrack);
  };

  const handleInteraction = (value: boolean) => {
    setSfxInteraction(value);
    audioService.setInteractionEnabled(value);
  };

  const handleVibration = (value: boolean) => {
    setVibration(value);
  };

  const handleFeedback = (value: boolean) => {
    setSfxFeedback(value);
    audioService.setFeedbackEnabled(value);
  };

  const handlePrevTrack = async () => {
    const prev = (currentTrackIndex - 1 + BG_TRACKS.length) % BG_TRACKS.length;
    const key = BG_TRACKS[prev].key;
    setBgTrack(key);
    await audioService.switchBgTrack(key);
  };

  const handleNextTrack = async () => {
    const next = (currentTrackIndex + 1) % BG_TRACKS.length;
    const key = BG_TRACKS[next].key;
    setBgTrack(key);
    await audioService.switchBgTrack(key);
  };

  // ─── Notification permission ───────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get notification permission');
      }
    })();
  }, []);

  const scheduleTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Eco-Verse 🌱',
        body: 'Đây là thông báo thử nghiệm sau 10 giây!',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      } as Notifications.TimeIntervalTriggerInput,
    });
  };

  const handleBack = () => navigation.goBack();
  const handleHelp = () => setShowHelpModal(true);
  const handleLogout = async () => await logout();

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScreenBackground />

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
          <View style={styles.settingsContainer}>
            {/* ── Sound Section ────────────────────────────────────────── */}
            <View style={styles.soundCard}>
              {/* Row header (tap to expand) */}
              <TouchableOpacity
                style={styles.soundHeader}
                onPress={toggleSoundExpanded}
                activeOpacity={0.75}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                    <MaterialCommunityIcons name="music-note" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text variant="titleSmall" style={styles.settingTitle}>
                      Âm thanh game
                    </Text>
                    <Text variant="bodySmall" style={styles.settingSubtitle}>
                      {masterSoundEnabled ? 'Đang bật' : 'Đã tắt'}
                    </Text>
                  </View>
                </View>
                <View style={styles.soundHeaderRight}>
                  <Switch
                    value={masterSoundEnabled}
                    onValueChange={handleMasterSound}
                    color={colors.primary}
                  />
                  <MaterialCommunityIcons
                    name={soundExpanded ? 'chevron-up' : 'chevron-down'}
                    size={22}
                    color={colors.text.disabled}
                    style={{ marginLeft: 4 }}
                  />
                </View>
              </TouchableOpacity>

              {/* Expanded sub-items */}
              {soundExpanded && (
                <View style={styles.soundSubItems}>
                  {/* Divider */}
                  <View style={styles.divider} />

                  {/* Nhạc nền */}
                  <View style={[styles.subRow, !masterSoundEnabled && styles.disabledRow]}>
                    <View style={styles.settingLeft}>
                      <MaterialCommunityIcons
                        name="music"
                        size={20}
                        color={colors.primary}
                        style={styles.subIcon}
                      />
                      <Text variant="bodyMedium" style={styles.subLabel}>
                        Nhạc nền
                      </Text>
                    </View>
                    <Switch
                      disabled={!masterSoundEnabled}
                      value={bgMusicEnabled}
                      onValueChange={handleBgMusic}
                      color={colors.primary}
                    />
                  </View>

                  {/* Track picker — hiện chỉ khi nhạc nền bật */}
                  {bgMusicEnabled && masterSoundEnabled && (
                    <View style={styles.trackPicker}>
                      <TouchableOpacity onPress={handlePrevTrack} style={styles.trackArrow}>
                        <MaterialCommunityIcons
                          name="chevron-left"
                          size={22}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                      <View style={styles.trackLabelWrap}>
                        <MaterialCommunityIcons
                          name="music-circle"
                          size={16}
                          color={colors.primary}
                        />
                        <Text style={styles.trackLabel} numberOfLines={1}>
                          {BG_TRACKS[currentTrackIndex]?.label ?? currentBgTrack}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={handleNextTrack} style={styles.trackArrow}>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={22}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Rung */}
                  <View style={styles.subRow}>
                    <View style={styles.settingLeft}>
                      <MaterialCommunityIcons
                        name="vibrate"
                        size={20}
                        color={colors.secondary}
                        style={styles.subIcon}
                      />
                      <Text variant="bodyMedium" style={styles.subLabel}>
                        Rung
                      </Text>
                    </View>
                    <Switch
                      value={vibrationEnabled}
                      onValueChange={handleVibration}
                      color={colors.primary}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* ── Notification Section ─────────────────────────────────── */}
            <View style={styles.notificationCard}>
              <View style={styles.settingItemInner}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: '#FFE8CC' }]}>
                    <MaterialCommunityIcons name="bell" size={24} color={colors.secondary} />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text variant="titleSmall" style={styles.settingTitle}>
                      Thông báo
                    </Text>
                    <Text variant="bodySmall" style={styles.settingSubtitle}>
                      Hiện thị trên màn hình khóa
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationEnabled}
                  onValueChange={setNotificationEnabled}
                  color={colors.primary}
                />
              </View>

              {notificationEnabled && (
                <TouchableOpacity
                  style={styles.testNotifButton}
                  onPress={scheduleTestNotification}
                  activeOpacity={0.75}
                >
                  <MaterialCommunityIcons name="bell-ring" size={18} color="#fff" />
                  <Text style={styles.testNotifText}>Kiểm tra thông báo (10s)</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── Help & Feedback ────────────────────────────────────── */}
            <TouchableOpacity style={styles.settingItem} onPress={handleHelp} activeOpacity={0.75}>
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
                    Trợ giúp &amp; Phản hồi
                  </Text>
                  <Text variant="bodySmall" style={styles.settingSubtitle}>
                    Liên hệ hỗ trợ và gửi góp ý
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text.disabled} />
            </TouchableOpacity>
          </View>

          {/* Version */}
          <View style={styles.versionContainer}>
            <Text variant="bodySmall" style={styles.versionText}>
              Phiên bản 1.0.3 (Build 204)
            </Text>
          </View>

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={20} color={colors.status.error} />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Help & Support Modal ── */}
      <Modal
        visible={showHelpModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={helpStyles.overlay}>
          <View style={helpStyles.sheet}>
            {/* Handle */}
            <View style={helpStyles.handle} />

            <View style={helpStyles.iconRow}>
              <View style={helpStyles.iconBg}>
                <MaterialCommunityIcons name="headset" size={32} color={colors.accentPurple} />
              </View>
            </View>
            <Text style={helpStyles.title}>Trợ giúp &amp; Hỗ trợ</Text>
            <Text style={helpStyles.subtitle}>Liên hệ đội ngũ EcoVerse để được hỗ trợ</Text>

            {/* Contact cards */}
            <TouchableOpacity
              style={helpStyles.contactRow}
              activeOpacity={0.75}
              onPress={() => Linking.openURL('mailto:ecoversesystem2026@gmail.com')}
            >
              <View style={[helpStyles.contactIcon, { backgroundColor: '#EDE7F6' }]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={22}
                  color={colors.accentPurple}
                />
              </View>
              <View style={helpStyles.contactText}>
                <Text style={helpStyles.contactLabel}>Email hỗ trợ</Text>
                <Text style={helpStyles.contactValue}>ecoversesystem2026@gmail.com</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#BDBDBD" />
            </TouchableOpacity>

            <TouchableOpacity
              style={helpStyles.contactRow}
              activeOpacity={0.75}
              onPress={() => Linking.openURL('https://datn-ashy.vercel.app/')}
            >
              <View style={[helpStyles.contactIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="web" size={22} color={colors.accentBlue} />
              </View>
              <View style={helpStyles.contactText}>
                <Text style={helpStyles.contactLabel}>Trung tâm hỗ trợ</Text>
                <Text style={helpStyles.contactValue}>datn-ashy.vercel.app</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#BDBDBD" />
            </TouchableOpacity>

            <TouchableOpacity
              style={helpStyles.contactRow}
              activeOpacity={0.75}
              onPress={() => Linking.openURL('tel:090113095')}
            >
              <View style={[helpStyles.contactIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="phone-outline" size={22} color={colors.primary} />
              </View>
              <View style={helpStyles.contactText}>
                <Text style={helpStyles.contactLabel}>Hotline (7:00 – 21:00)</Text>
                <Text style={helpStyles.contactValue}>090 1130 395</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#BDBDBD" />
            </TouchableOpacity>

            <View style={helpStyles.versionNote}>
              <Text style={helpStyles.versionNoteText}>Ứng dụng EcoVerse • Phiên bản 1.0.3</Text>
            </View>

            <TouchableOpacity
              style={helpStyles.closeBtn}
              onPress={() => setShowHelpModal(false)}
              activeOpacity={0.8}
            >
              <Text style={helpStyles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  safeArea: { flex: 1, zIndex: 10 },
  header: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerTitle: { color: colors.text.primary, fontWeight: 'bold' },
  scrollContent: { paddingVertical: spacing.lg },
  settingsContainer: { gap: spacing.xs, paddingHorizontal: spacing.base },

  // Generic setting row (Help button)
  settingItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingLeft: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: spacing.md },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  settingTextContainer: { flex: 1 },
  settingTitle: { color: colors.text.primary, fontWeight: '600' },
  settingSubtitle: { color: colors.text.secondary, marginTop: 2 },

  // ── Sound card ──────────────────────────────────────────────────────────────
  soundCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    elevation: 1,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  soundHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  soundHeaderRight: { alignItems: 'center', flexDirection: 'row' },
  soundSubItems: { paddingBottom: spacing.sm },
  divider: {
    backgroundColor: colors.background,
    height: 1,
    marginBottom: spacing.xs,
    marginHorizontal: spacing.base,
  },
  subRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  disabledRow: { opacity: 0.4 },
  subIcon: { marginRight: -spacing.xs },
  subLabel: { color: colors.text.primary, fontWeight: '500' },

  // Track picker
  trackPicker: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    marginHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  trackArrow: {
    padding: spacing.xs,
  },
  trackLabelWrap: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  trackLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Notification card
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    elevation: 1,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingItemInner: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  testNotifButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginBottom: spacing.base,
    marginHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  testNotifText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  // Version & Logout
  versionContainer: { alignItems: 'center', paddingVertical: spacing.xl },
  versionText: { color: colors.text.secondary },

  logoutContainer: { paddingHorizontal: spacing.base, paddingTop: spacing.md },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#FFEBEE',
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    elevation: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  logoutText: { color: colors.status.error, fontSize: 15, fontWeight: '600' },
});

const helpStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    height: 4,
    marginBottom: 20,
    width: 44,
  },
  iconRow: { alignItems: 'center', marginBottom: 12 },
  iconBg: {
    alignItems: 'center',
    backgroundColor: '#EDE7F6',
    borderRadius: 28,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: { flex: 1, gap: 2 },
  contactLabel: { fontSize: 13, fontWeight: '700', color: '#424242' },
  contactValue: { fontSize: 12, color: '#757575', fontWeight: '500' },
  versionNote: { alignItems: 'center', paddingVertical: 16 },
  versionNoteText: { fontSize: 11, color: '#BDBDBD', fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 15, fontWeight: '700', color: '#424242' },
});
