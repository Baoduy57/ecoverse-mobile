import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { borderRadius, colors, spacing } from '../../theme';
import { StudentQuizTemplate } from '../../types/quiz';

type QuizListItemCardProps = {
  item: StudentQuizTemplate;
  onPress: (item: StudentQuizTemplate) => void;
};

export default function QuizListItemCard({ item, onPress }: QuizListItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={[styles.statusBadge, item.active ? styles.activeBadge : styles.inactiveBadge]}>
          <Text style={styles.statusText}>{item.active ? 'ACTIVE' : 'INACTIVE'}</Text>
        </View>
        {item.partner_name ? <Text style={styles.partnerName}>{item.partner_name}</Text> : null}
      </View>

      <Text style={styles.title}>{item.title}</Text>
      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      ) : (
        <Text style={styles.descriptionMuted}>Chưa có mô tả</Text>
      )}

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={14}
            color={colors.text.secondary}
          />
          <Text style={styles.metaText}>{item.question_count} câu</Text>
        </View>
        {item.partner_id ? (
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="office-building-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.partner_id.slice(0, 8)}
            </Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={() => onPress(item)}
      >
        <Text style={styles.startButtonText}>Bắt đầu</Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color={colors.text.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  activeBadge: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    elevation: 4,
    marginBottom: spacing.md,
    padding: spacing.base,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  descriptionMuted: {
    color: colors.text.disabled,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metaText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  partnerName: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  startButtonText: {
    color: colors.text.white,
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusText: {
    color: colors.text.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  title: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
});
