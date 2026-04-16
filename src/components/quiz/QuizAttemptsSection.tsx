import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { borderRadius, colors, spacing } from '../../theme';
import { StudentQuizSubmitResult } from '../../types/quiz';

type QuizAttemptsSectionProps = {
  attempts: StudentQuizSubmitResult[];
};

export default function QuizAttemptsSection({ attempts }: QuizAttemptsSectionProps) {
  const recentAttempts = useMemo(() => {
    return [...attempts]
      .sort((a, b) => {
        const timeA = Date.parse(a.created_at || '') || 0;
        const timeB = Date.parse(b.created_at || '') || 0;
        return timeB - timeA;
      })
      .slice(0, 5);
  }, [attempts]);

  if (recentAttempts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <MaterialCommunityIcons name="history" size={28} color={colors.text.disabled} />
        </View>
        <Text style={styles.emptyText}>Chưa có lịch sử làm bài kiểm tra</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recentAttempts.map(item => (
        <View key={item.attempt_id} style={styles.item}>
          <View style={styles.row}>
            <View style={styles.leftRow}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="check-decagram" size={20} color={colors.primary} />
              </View>
              <Text style={styles.title} numberOfLines={2}>
                {item.quiz_title}
              </Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.score}>{item.score}%</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <MaterialCommunityIcons name="bullseye-arrow" size={14} color={colors.primaryDark} />
              <Text style={styles.metaText}>
                {item.correct_amount}/{item.total_questions} Đúng
              </Text>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: '#FFF4D7' }]}>
              <MaterialCommunityIcons name="restart" size={14} color={colors.secondary} />
              <Text style={[styles.metaText, { color: colors.secondaryDark }]}>
                Lần thử {item.attempt_number}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    paddingVertical: spacing.xl,
  },
  emptyIconWrap: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 50,
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.text.secondary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  item: {
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.sm,
  },
  leftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: spacing.sm,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  metaText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  scoreBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  score: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '900',
  },
  title: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
});
