import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScheduledExam, ExamStatus } from '../../types/exam';
import { colors, spacing } from '@theme';

interface ScheduledExamCardProps {
  exam: ScheduledExam | null;
  onPress: () => void;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${hours}:${minutes} ${day}/${month}`;
}

function getStatusLabel(status: ExamStatus): { label: string; color: string; bgColor: string } {
  switch (status) {
    case ExamStatus.ACTIVE:
      return { label: 'Đang diễn ra', color: '#10B981', bgColor: '#D1FAE5' };
    case ExamStatus.UPCOMING:
      return { label: 'Sắp diễn ra', color: '#F59E0B', bgColor: '#FEF3C7' };
    case ExamStatus.ENDED:
      return { label: 'Đã kết thúc', color: '#6B7280', bgColor: '#F3F4F6' };
  }
}

export default function ScheduledExamCard({ exam, onPress }: ScheduledExamCardProps) {
  if (!exam) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconBox}>
          <MaterialCommunityIcons name="calendar-remove" size={32} color="#9CA3AF" />
        </View>
        <Text style={styles.emptyText}>Hiện tại không có bài kiểm tra định kỳ</Text>
        <Text style={styles.emptySubText}>Nhà trường chưa lên lịch kiểm tra mới</Text>
      </View>
    );
  }

  const statusInfo = getStatusLabel(exam.status);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={styles.examCard}>
        <View style={styles.examLeftSection}>
          <View style={styles.examIconBox}>
            <MaterialCommunityIcons name="file-document-edit" size={32} color="#0EA5E9" />
          </View>
        </View>
        <View style={styles.examContent}>
          <View style={[styles.examBadge, { backgroundColor: statusInfo.bgColor }]}>
            <MaterialCommunityIcons name="school" size={12} color={statusInfo.color} />
            <Text style={[styles.examBadgeText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
          <Text style={styles.examTitle} numberOfLines={1}>
            {exam.title}
          </Text>
          <View style={styles.examMetaRow}>
            <View style={styles.examMetaItem}>
              <MaterialCommunityIcons name="help-circle" size={14} color="#0EA5E9" />
              <Text style={styles.examMetaText}>{exam.questionCount} câu</Text>
            </View>
            <View style={styles.examMetaDot} />
            <View style={styles.examMetaItem}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#0EA5E9" />
              <Text style={styles.examMetaText}>{exam.duration} phút</Text>
            </View>
          </View>
          <View style={styles.examTimeRow}>
            <MaterialCommunityIcons name="calendar-clock" size={13} color="#6B7280" />
            <Text style={styles.examTimeText}>
              {formatDateTime(exam.startTime)} – {formatDateTime(exam.endTime)}
            </Text>
          </View>
        </View>
        <View style={styles.examArrowButton}>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#0EA5E9" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  examCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'rgba(14, 165, 233, 0.15)',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 6,
    flexDirection: 'row',
    padding: spacing.base,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  examLeftSection: {
    marginRight: spacing.md,
  },
  examIconBox: {
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderColor: 'rgba(14, 165, 233, 0.2)',
    borderRadius: 16,
    borderWidth: 3,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  examContent: {
    flex: 1,
  },
  examBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  examBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  examTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  examMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  examMetaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  examMetaText: {
    color: '#0EA5E9',
    fontSize: 13,
    fontWeight: '600',
  },
  examMetaDot: {
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  examTimeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  examTimeText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
  },
  examArrowButton: {
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: spacing.sm,
    width: 40,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 2,
    gap: spacing.xs,
    paddingVertical: spacing.xl,
    shadowColor: '#6B7280',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  emptyIconBox: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    height: 64,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 64,
  },
  emptyText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubText: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
