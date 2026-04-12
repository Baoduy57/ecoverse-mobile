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

  const hasHistory = (stage.playsCount ?? 0) > 0;
  const stageBadge = hasHistory ? 'Đã hoàn thành' : 'Màn mới';

  return (
    <LinearGradient
      colors={['#43A047', '#2E7D32']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.glowBubbleLarge} />
      <View style={styles.glowBubbleSmall} />
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.label}>MÀN ĐÃ CHỌN</Text>
          <Text numberOfLines={2} style={styles.title}>
            {stage.title}
          </Text>
          <Text numberOfLines={1} style={styles.descriptionText}>
            {stage.description}
          </Text>

          <View style={styles.stageBadge}>
            <MaterialCommunityIcons
              name={hasHistory ? 'check-circle-outline' : 'star-outline'}
              size={13}
              color={colors.text.white}
            />
            <Text style={styles.stageBadgeText}>{stageBadge}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.iconBubble}>
            <MaterialCommunityIcons name={getTopicIcon()} size={28} color={colors.text.white} />
          </View>

          <TouchableOpacity style={styles.playButton} onPress={onPlay}>
            <MaterialCommunityIcons name="play" size={16} color={colors.primary} />
            <Text style={styles.playText}>PLAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    elevation: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 146,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  descriptionText: {
    color: colors.text.white,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    opacity: 0.9,
  },
  glowBubbleLarge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 70,
    height: 140,
    position: 'absolute',
    right: -30,
    top: -28,
    width: 140,
  },
  glowBubbleSmall: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 50,
    bottom: -18,
    height: 90,
    position: 'absolute',
    right: 48,
    width: 90,
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  label: {
    color: colors.text.white,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    opacity: 0.8,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    elevation: 2,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    minWidth: 92,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  playText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },
  rightSection: {
    alignItems: 'center',
    gap: 10,
    zIndex: 2,
  },
  stageBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  stageBadgeText: {
    color: colors.text.white,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: colors.text.white,
    fontSize: 20,
    fontWeight: '800',
  },
});
