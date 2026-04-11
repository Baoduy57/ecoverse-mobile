import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import type { Level } from '../../types/game';

interface CurrentStageCardProps {
  stage: Level;
  onPlay: () => void;
}

export default function CurrentStageCard({ stage, onPlay }: CurrentStageCardProps) {
  // Get topic icon based on stage title
  const getTopicIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    const title = stage.title.toUpperCase();
    if (title.includes('Ủ') || title.includes('PHÂN')) return 'sprout';
    if (title.includes('TÁI CHẾ')) return 'recycle';
    if (title.includes('CƠ BẢN')) return 'check-all';
    if (title.includes('GIẢM')) return 'minus-circle';
    if (title.includes('TÁI DÙNG')) return 'refresh';
    if (title.includes('MUA')) return 'shopping';
    if (title.includes('ĐIỆN')) return 'lightning-bolt';
    if (title.includes('NƯỚC')) return 'water';
    if (title.includes('CHUYỂN')) return 'bike';
    if (title.includes('CHUYÊN')) return 'trophy';
    return 'leaf';
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          <Text style={styles.label}>MÀN ĐÃ CHỌN</Text>
          <Text numberOfLines={2} style={styles.title}>
            {stage.title}
          </Text>
          <Text numberOfLines={2} style={styles.descriptionText}>
            {stage.description}
          </Text>

          <TouchableOpacity style={styles.playButton} onPress={onPlay}>
            <MaterialCommunityIcons name="play" size={24} color={colors.primary} />
            <Text style={styles.playText}>CHƠI NGAY</Text>
          </TouchableOpacity>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          <View style={styles.topicIconContainer}>
            <MaterialCommunityIcons
              name={getTopicIcon()}
              size={48}
              color={colors.text.white}
              style={{ opacity: 0.3 }}
            />
          </View>

          <View style={styles.statsColumn}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={16}
                  color={colors.text.white}
                />
                <Text style={styles.statLabel}>Số câu</Text>
              </View>
              <Text style={styles.statValue}>{stage.itemCount ?? 0}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <MaterialCommunityIcons name="controller" size={16} color={colors.text.white} />
                <Text style={styles.statLabel}>Lần chơi</Text>
              </View>
              <Text style={styles.statValue}>{stage.playsCount ?? 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    elevation: 4,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    gap: 14,
    minHeight: 210,
    padding: 18,
  },
  descriptionText: {
    color: colors.text.white,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    opacity: 0.92,
  },
  label: {
    color: colors.text.white,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    opacity: 0.8,
  },
  leftSection: {
    flex: 0.56,
    justifyContent: 'space-between',
  },
  playButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 2,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  playText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  rightSection: {
    flex: 0.44,
    justifyContent: 'center',
    paddingTop: 8,
    position: 'relative',
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  statLabel: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.92,
  },
  statsColumn: {
    gap: 8,
  },
  statValue: {
    color: colors.text.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  title: {
    color: colors.text.white,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 4,
  },
  topicIconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
