import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, colors, spacing } from '../../theme';
import { StudentQuizTemplate } from '../../types/quiz';

type QuizListItemCardProps = {
  item: StudentQuizTemplate;
  index: number;
  onPress: (item: StudentQuizTemplate) => void;
};

export default function QuizListItemCard({ item, index, onPress }: QuizListItemCardProps) {
  const gradientColors = colors.gameCardGradients[index % colors.gameCardGradients.length];

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(item)} style={styles.wrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative bubbles */}
        <View style={styles.glowBubbleLarge} />
        <View style={styles.glowBubbleSmall} />

        <View style={styles.content}>
          {/* Badge & Partner Row */}
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, item.active ? styles.activeBadge : styles.inactiveBadge]}>
              <MaterialCommunityIcons
                name={item.active ? 'check-decagram' : 'alert-circle-outline'}
                size={12}
                color={item.active ? '#16A34A' : '#DC2626'}
              />
              <Text style={[styles.statusText, item.active ? styles.activeText : styles.inactiveText]}>
                {item.active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
            {item.partner_name ? (
              <View style={styles.partnerBadge}>
                <MaterialCommunityIcons name="office-building" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.partnerName} numberOfLines={1}>
                  {item.partner_name}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Title and Description */}
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          ) : (
            <Text style={styles.descriptionMuted}>Chưa có mô tả</Text>
          )}

          {/* Bottom Meta & Action */}
          <View style={styles.bottomRow}>
            <View style={styles.metaBadge}>
              <MaterialCommunityIcons name="format-list-numbered" size={14} color={gradientColors[1]} />
              <Text style={[styles.metaText, { color: gradientColors[1] }]}>
                {item.question_count} CÂU HỎI
              </Text>
            </View>
            <View style={styles.startButtonWrap}>
              <Text style={styles.startButtonText}>Bắt đầu</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={gradientColors[1]} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    padding: spacing.base,
  },
  glowBubbleLarge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 100,
    height: 160,
    position: 'absolute',
    right: -30,
    top: -40,
    width: 160,
  },
  glowBubbleSmall: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 60,
    bottom: -20,
    height: 90,
    position: 'absolute',
    right: 70,
    width: 90,
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    zIndex: 2,
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeBadge: {
    backgroundColor: 'rgba(220, 252, 231, 0.9)', // Light green
  },
  inactiveBadge: {
    backgroundColor: 'rgba(254, 226, 226, 0.9)', // Light red
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeText: {
    color: '#16A34A',
  },
  inactiveText: {
    color: '#DC2626',
  },
  partnerBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 120,
  },
  partnerName: {
    color: colors.text.white,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: colors.text.white,
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 24,
    marginBottom: spacing.xs,
    zIndex: 2,
  },
  description: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: spacing.md,
    zIndex: 2,
  },
  descriptionMuted: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: spacing.md,
    zIndex: 2,
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  metaBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  startButtonWrap: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});
