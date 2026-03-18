import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import ScreenBackground from '../../components/common/ScreenBackground';
import { MOCK_NOTIFICATIONS, getTimeAgo } from '../../data/notificationData';
import type { Notification, NotificationType } from '../../types/notification';
import type { AppStackParamList } from '../../navigation/AppNavigator';

export default function NotificationScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const handleNotificationPress = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (!notification.actionRoute) return;
    const route = notification.actionRoute as keyof AppStackParamList;
    navigation.navigate(route as any);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Thông báo</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="check-all" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="bell-off" size={80} color="#E0E0E0" />
              <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
              <Text style={styles.emptySubtext}>Các thông báo mới sẽ xuất hiện ở đây</Text>
            </View>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.notificationCardUnread,
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.7}
                >
                  {/* Icon */}
                  <View
                    style={[
                      styles.notificationIcon,
                      { backgroundColor: notification.iconBgColor || '#F5F5F5' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={notification.icon as any}
                      size={28}
                      color={notification.iconColor || colors.primary}
                    />
                  </View>

                  {/* Content */}
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle} numberOfLines={2}>
                        {notification.title}
                      </Text>
                      {!notification.isRead && <View style={styles.unreadDot} />}
                    </View>

                    <Text style={styles.notificationMessage} numberOfLines={3}>
                      {notification.message}
                    </Text>

                    <View style={styles.notificationFooter}>
                      <View style={styles.timeContainer}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={12}
                          color={colors.text.disabled}
                        />
                        <Text style={styles.notificationTime}>
                          {getTimeAgo(notification.timestamp)}
                        </Text>
                      </View>

                      {notification.actionText && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          activeOpacity={0.7}
                          onPress={() => handleNotificationPress(notification)}
                        >
                          <Text style={styles.actionButtonText}>{notification.actionText}</Text>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={14}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Bottom padding */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    backgroundColor: '#F0F9FF',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['5xl'],
  },
  emptySubtext: {
    color: colors.text.disabled,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  markAllButton: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  notificationCardUnread: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOpacity: 0.1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  notificationIcon: {
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 28,
    borderWidth: 2,
    height: 56,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 56,
  },
  notificationMessage: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  notificationTime: {
    color: colors.text.disabled,
    fontSize: 12,
    fontWeight: '500',
  },
  notificationTitle: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  scrollView: {
    flex: 1,
  },
  timeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  unreadBadge: {
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '800',
  },
  unreadDot: {
    backgroundColor: '#EF4444',
    borderRadius: 5,
    height: 10,
    marginTop: 6,
    width: 10,
  },
});
