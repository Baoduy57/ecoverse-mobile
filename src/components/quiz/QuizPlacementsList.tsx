import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { borderRadius, colors, spacing } from '../../theme';
import { StudentQuizPlacement } from '../../types/quiz';

type QuizPlacementsListProps = {
  placements: StudentQuizPlacement[];
};

export default function QuizPlacementsList({ placements }: QuizPlacementsListProps) {
  return (
    <View style={styles.container}>
      {placements.map((placement, index) => (
        <View key={`${placement.question_id}-${index}`} style={styles.item}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons
              name={placement.is_correct ? 'check-circle' : 'close-circle'}
              size={18}
              color={placement.is_correct ? colors.status.success : colors.status.error}
            />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.question} numberOfLines={2}>
              {placement.question_text}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              Bạn chọn: {placement.selected_answer ?? 'Bỏ qua'}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              Đáp án đúng: {placement.correct_answer ?? 'Không có'}
            </Text>
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
  iconWrap: {
    marginTop: 2,
  },
  item: {
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  meta: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  question: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
});
