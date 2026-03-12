import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { ExamStatus, ScheduledExam } from '../../types/exam';
import { MOCK_SCHEDULED_EXAMS } from '../../data/examData';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';

function formatFullDateTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}

function getStatusInfo(status: ExamStatus): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
} {
  switch (status) {
    case ExamStatus.ACTIVE:
      return {
        label: 'Đang diễn ra',
        color: '#10B981',
        bgColor: '#D1FAE5',
        icon: 'play-circle',
      };
    case ExamStatus.UPCOMING:
      return {
        label: 'Sắp diễn ra',
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        icon: 'clock-outline',
      };
    case ExamStatus.ENDED:
      return {
        label: 'Đã kết thúc',
        color: '#6B7280',
        bgColor: '#F3F4F6',
        icon: 'check-circle',
      };
  }
}

interface ExamItemCardProps {
  exam: ScheduledExam;
  onPress: (exam: ScheduledExam) => void;
}

function ExamItemCard({ exam, onPress }: ExamItemCardProps) {
  const statusInfo = getStatusInfo(exam.status);
  const canStart = exam.status === ExamStatus.ACTIVE;

  return (
    <TouchableOpacity activeOpacity={canStart ? 0.7 : 1} onPress={() => canStart && onPress(exam)}>
      <View style={[styles.examCard, !canStart && styles.examCardDisabled]}>
        {/* Header row */}
        <View style={styles.examCardHeader}>
          <View style={styles.examIconBox}>
            <MaterialCommunityIcons
              name="file-document-edit"
              size={28}
              color={canStart ? '#0EA5E9' : '#9CA3AF'}
            />
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
            <MaterialCommunityIcons
              name={statusInfo.icon as any}
              size={12}
              color={statusInfo.color}
            />
            <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Title & school */}
        <Text style={styles.examTitle}>{exam.title}</Text>
        <Text style={styles.examSchool}>
          <MaterialCommunityIcons name="school" size={13} color="#6B7280" /> {exam.createdBy}
        </Text>
        <Text style={styles.examDescription} numberOfLines={2}>
          {exam.description}
        </Text>

        {/* Meta info */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={16} color="#0EA5E9" />
            <Text style={styles.metaLabel}>{exam.questionCount} câu hỏi</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#0EA5E9" />
            <Text style={styles.metaLabel}>{exam.duration} phút</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="star-circle-outline" size={16} color="#0EA5E9" />
            <Text style={styles.metaLabel}>{exam.totalPoints} điểm</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="book-open-variant" size={16} color="#0EA5E9" />
            <Text style={styles.metaLabel}>{exam.subject}</Text>
          </View>
        </View>

        {/* Time range */}
        <View style={styles.timeSection}>
          <View style={styles.timeRow}>
            <MaterialCommunityIcons name="calendar-arrow-right" size={14} color="#6B7280" />
            <Text style={styles.timeLabel}>Bắt đầu:</Text>
            <Text style={styles.timeValue}>{formatFullDateTime(exam.startTime)}</Text>
          </View>
          <View style={styles.timeRow}>
            <MaterialCommunityIcons name="calendar-arrow-left" size={14} color="#6B7280" />
            <Text style={styles.timeLabel}>Kết thúc:</Text>
            <Text style={styles.timeValue}>{formatFullDateTime(exam.endTime)}</Text>
          </View>
        </View>

        {/* Action button */}
        {canStart && (
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.8}
            onPress={() => onPress(exam)}
          >
            <MaterialCommunityIcons name="play" size={18} color={colors.text.white} />
            <Text style={styles.startButtonText}>Bắt đầu làm bài</Text>
          </TouchableOpacity>
        )}
        {exam.status === ExamStatus.UPCOMING && (
          <View style={styles.upcomingNote}>
            <MaterialCommunityIcons name="information-outline" size={14} color="#F59E0B" />
            <Text style={styles.upcomingNoteText}>Bài kiểm tra chưa đến giờ mở</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ScheduledExamScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const [pendingExam, setPendingExam] = useState<ScheduledExam | null>(null);

  const handleStartExam = () => {
    if (!pendingExam) return;
    const exam = pendingExam;
    setPendingExam(null);
    navigation.navigate('ExamQuestion', { examId: exam.id });
  };

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home' as never)}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kiểm tra định kỳ</Text>
          <View style={styles.headerIconBox}>
            <MaterialCommunityIcons name="calendar-check" size={22} color="#0EA5E9" />
          </View>
        </View>

        {/* Sub-header label */}
        <View style={styles.subHeaderRow}>
          <MaterialCommunityIcons name="school-outline" size={15} color={colors.text.secondary} />
          <Text style={styles.subHeaderText}>Bài kiểm tra do nhà trường lên lịch</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {MOCK_SCHEDULED_EXAMS.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <MaterialCommunityIcons name="calendar-remove" size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>Không có bài kiểm tra</Text>
              <Text style={styles.emptySubtitle}>
                Nhà trường chưa lên lịch bài kiểm tra định kỳ nào.{'\n'}Hãy kiểm tra lại sau!
              </Text>
            </View>
          ) : (
            MOCK_SCHEDULED_EXAMS.map(exam => (
              <ExamItemCard key={exam.id} exam={exam} onPress={setPendingExam} />
            ))
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Confirmation Dialog */}
      <Modal
        visible={pendingExam !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingExam(null)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <View style={styles.dialogIconRow}>
              <View style={styles.dialogIconBg}>
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={32}
                  color="#0EA5E9"
                />
              </View>
            </View>
            <Text style={styles.dialogTitle}>Bắt đầu làm bài?</Text>
            <Text style={styles.dialogExamTitle} numberOfLines={2}>
              {pendingExam?.title}
            </Text>
            <View style={styles.dialogMetaRow}>
              <View style={styles.dialogMetaChip}>
                <MaterialCommunityIcons name="help-circle-outline" size={14} color="#0EA5E9" />
                <Text style={styles.dialogMetaText}>{pendingExam?.questionCount} câu</Text>
              </View>
              <View style={styles.dialogMetaChip}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#0EA5E9" />
                <Text style={styles.dialogMetaText}>{pendingExam?.duration} phút</Text>
              </View>
              <View style={styles.dialogMetaChip}>
                <MaterialCommunityIcons name="star-circle-outline" size={14} color="#0EA5E9" />
                <Text style={styles.dialogMetaText}>{pendingExam?.totalPoints} điểm</Text>
              </View>
            </View>
            <Text style={styles.dialogWarning}>
              Sau khi bắt đầu, thời gian sẽ được tính liên tục.
            </Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={styles.dialogCancelBtn}
                onPress={() => setPendingExam(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.dialogCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogConfirmBtn}
                onPress={handleStartExam}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="play" size={18} color={colors.text.white} />
                <Text style={styles.dialogConfirmText}>Bắt đầu</Text>
              </TouchableOpacity>
            </View>
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
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    elevation: 2,
    height: 40,
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 40,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  headerIconBox: {
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  subHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingBottom: spacing.md,
    paddingHorizontal: 20,
  },
  subHeaderText: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  // Exam card
  examCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(14, 165, 233, 0.15)',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 6,
    marginBottom: 16,
    padding: spacing.base,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  examCardDisabled: {
    borderColor: 'rgba(156, 163, 175, 0.2)',
    shadowColor: '#6B7280',
    shadowOpacity: 0.08,
  },
  examCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  examIconBox: {
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderColor: 'rgba(14, 165, 233, 0.2)',
    borderRadius: 14,
    borderWidth: 2,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  examTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  examSchool: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  examDescription: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  metaItem: {
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  metaLabel: {
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: '600',
  },
  timeSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    gap: 6,
    marginBottom: spacing.md,
    padding: spacing.sm,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  timeLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    width: 60,
  },
  timeValue: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  startButtonText: {
    color: colors.text.white,
    fontSize: 15,
    fontWeight: '700',
  },
  upcomingNote: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  upcomingNoteText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyIconBox: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 100,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  // Confirmation dialog
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogBox: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },
  dialogIconRow: {
    marginBottom: 12,
  },
  dialogIconBg: {
    backgroundColor: '#E0F2FE',
    borderRadius: 50,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  dialogExamTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 20,
  },
  dialogMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dialogMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dialogMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  dialogWarning: {
    fontSize: 12,
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    width: '100%',
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dialogCancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  dialogCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  dialogConfirmBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0EA5E9',
  },
  dialogConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.white,
  },
});
