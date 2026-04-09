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
        <MaterialCommunityIcons name="history" size={20} color={colors.text.secondary} />
        <Text style={styles.emptyText}>Chưa có lịch sử làm bài kiểm tra</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recentAttempts.map(item => (
        <View key={item.attempt_id} style={styles.item}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>
              {item.quiz_title}
            </Text>
            <Text style={styles.score}>{item.score}%</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {item.correct_amount}/{item.total_questions} Đúng
            </Text>
            <Text style={styles.metaText}>Lần thử {item.attempt_number}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
  },
  emptyText: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  item: {
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  metaText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  score: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  title: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
});
