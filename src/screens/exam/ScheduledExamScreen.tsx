import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { competitionApi } from '../../services/api/competition';
import {
  ICompetition,
  CompetitionStatus,
  parseCompetitionDateTime,
  getCompetitionType,
  getCompetitionActivityId,
} from '../../types/competition';
import { useAuthStore } from '../../store/authStore';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';

function formatFullDateTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}

function getStatusInfo(status: CompetitionStatus): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
} {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Đang diễn ra',
        color: '#10B981',
        bgColor: '#D1FAE5',
        icon: 'play-circle',
      };
    case 'DRAFT':
      return {
        label: 'Nháp',
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        icon: 'pencil-outline',
      };
    case 'FINISHED':
      return {
        label: 'Đã kết thúc',
        color: '#6B7280',
        bgColor: '#F3F4F6',
        icon: 'check-circle',
      };
    case 'CANCELED':
      return {
        label: 'Đã hủy',
        color: '#EF4444',
        bgColor: '#FEE2E2',
        icon: 'close-circle',
      };
    default:
      return {
        label: String(status),
        color: '#6B7280',
        bgColor: '#F3F4F6',
        icon: 'help-circle',
      };
  }
}

interface CompetitionCardProps {
  competition: ICompetition;
  onPress: (c: ICompetition) => void;
  onLeaderboard: (c: ICompetition) => void;
}

function CompetitionCard({ competition, onPress, onLeaderboard }: CompetitionCardProps) {
  const statusInfo = getStatusInfo(competition.status);
  const canStart = competition.status === 'ACTIVE';
  const type = getCompetitionType(competition);
  const startDate = parseCompetitionDateTime(competition.start_time);
  const endDate = parseCompetitionDateTime(competition.end_time);

  const typeInfo =
    type === 'QUIZ'
      ? { icon: 'clipboard-check', label: 'Trắc nghiệm', color: '#8B5CF6', bg: '#F5F3FF' }
      : { icon: 'gamepad-variant', label: 'Trò chơi', color: '#EF5350', bg: '#FFF5F5' };

  return (
    <View style={[styles.examCard, !canStart && styles.examCardDisabled]}>
      {/* Header row */}
      <View style={styles.examCardHeader}>
        <View style={[styles.examIconBox, { backgroundColor: typeInfo.bg, borderColor: typeInfo.color + '33' }]}>
          <MaterialCommunityIcons name={typeInfo.icon as any} size={28} color={canStart ? typeInfo.color : '#9CA3AF'} />
        </View>
        <View style={styles.headerBadges}>
          <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
            <Text style={[styles.typeBadgeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
            <MaterialCommunityIcons name={statusInfo.icon as any} size={12} color={statusInfo.color} />
            <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
        </View>
      </View>

      {/* Title & description */}
      <Text style={styles.examTitle}>{competition.title}</Text>
      {competition.description && (
        <Text style={styles.examDescription} numberOfLines={2}>
          {competition.description}
        </Text>
      )}

      {/* Meta info */}
      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="target" size={16} color="#0EA5E9" />
          <Text style={styles.metaLabel}>
            {competition.scope === 'SCHOOL' ? 'Toàn trường' : `Lớp ${competition.target_class}`}
          </Text>
        </View>
        {type === 'QUIZ' && competition.quiz_template && (
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={16} color="#0EA5E9" />
            <Text style={styles.metaLabel}>{competition.quiz_template.question_count} câu hỏi</Text>
          </View>
        )}
        {type === 'GAME' && competition.game_round && (
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="package-variant" size={16} color="#0EA5E9" />
            <Text style={styles.metaLabel}>{competition.game_round.item_count} vật phẩm</Text>
          </View>
        )}
        <View style={[styles.metaItem, { backgroundColor: '#FEF3C7' }]}>
          <MaterialCommunityIcons name="star-circle" size={16} color="#F59E0B" />
          <Text style={[styles.metaLabel, { color: '#B45309' }]}>{competition.score !== undefined && competition.score !== null ? competition.score : '0'} điểm</Text>
        </View>
      </View>

      {/* Time range */}
      <View style={styles.timeSection}>
        <View style={styles.timeRow}>
          <MaterialCommunityIcons name="calendar-arrow-right" size={14} color="#6B7280" />
          <Text style={styles.timeLabel}>Bắt đầu:</Text>
          <Text style={styles.timeValue}>{formatFullDateTime(startDate)}</Text>
        </View>
        <View style={styles.timeRow}>
          <MaterialCommunityIcons name="calendar-arrow-left" size={14} color="#6B7280" />
          <Text style={styles.timeLabel}>Kết thúc:</Text>
          <Text style={styles.timeValue}>{formatFullDateTime(endDate)}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        {canStart && (
          <TouchableOpacity style={styles.startButton} activeOpacity={0.8} onPress={() => onPress(competition)}>
            <MaterialCommunityIcons name="play" size={18} color={colors.text.white} />
            <Text style={styles.startButtonText}>
              {type === 'QUIZ' ? 'Bắt đầu làm bài' : 'Bắt đầu chơi'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.leaderboardButton} activeOpacity={0.8} onPress={() => onLeaderboard(competition)}>
          <MaterialCommunityIcons name="trophy-outline" size={18} color="#F59E0B" />
          <Text style={styles.leaderboardButtonText}>BXH</Text>
        </TouchableOpacity>
      </View>

      {competition.status === 'FINISHED' && (
        <View style={[styles.upcomingNote, { backgroundColor: '#F3F4F6' }]}>
          <MaterialCommunityIcons name="check-circle" size={14} color="#6B7280" />
          <Text style={[styles.upcomingNoteText, { color: '#6B7280' }]}>Cuộc thi đã kết thúc</Text>
        </View>
      )}
      {competition.status === 'CANCELED' && (
        <View style={[styles.upcomingNote, { backgroundColor: '#FEE2E2' }]}>
          <MaterialCommunityIcons name="close-circle" size={14} color="#EF4444" />
          <Text style={[styles.upcomingNoteText, { color: '#EF4444' }]}>Cuộc thi đã bị hủy</Text>
        </View>
      )}
    </View>
  );
}

export default function ScheduledExamScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const { user } = useAuthStore();
  const [competitions, setCompetitions] = useState<ICompetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCompetition, setPendingCompetition] = useState<ICompetition | null>(null);
  const [alreadyDoneCompetition, setAlreadyDoneCompetition] = useState<ICompetition | null>(null);
  const [isCheckingParticipant, setIsCheckingParticipant] = useState(false);

  const fetchCompetitions = useCallback(async () => {
    if (!user?.id) {
      setError('Không tìm thấy thông tin học sinh.');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await competitionApi.getCompetitions(user.id);

      // FE filter: ẩn DRAFT, hiển thị ACTIVE / FINISHED / CANCELED
      const filtered = data.filter(comp => {
        if (comp.status === 'DRAFT') return false;
        return true;
      });

      setCompetitions(filtered);
    } catch (err: any) {
      console.error('Error fetching competitions:', err);
      setError('Không thể tải danh sách cuộc thi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchCompetitions();
    }, [fetchCompetitions])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCompetitions();
    setIsRefreshing(false);
  };

  const handlePressCompetition = async (comp: ICompetition) => {
    if (!user?.id || isCheckingParticipant) return;

    setIsCheckingParticipant(true);
    try {
      const participant = await competitionApi.checkParticipant(comp.competition_id, user.id);
      if (participant !== null) {
        setAlreadyDoneCompetition(comp);
      } else {
        setPendingCompetition(comp);
      }
    } catch (err: any) {
      console.error('Error checking participant:', err);
      setPendingCompetition(comp);
    } finally {
      setIsCheckingParticipant(false);
    }
  };

  const handleStartCompetition = () => {
    if (!pendingCompetition) return;
    const comp = pendingCompetition;
    setPendingCompetition(null);

    const type = getCompetitionType(comp);
    const activityId = getCompetitionActivityId(comp);

    if (type === 'QUIZ') {
      navigation.navigate('ExamQuestion', {
        competitionId: comp.competition_id,
        quizTemplateId: activityId,
        competitionScore: comp.score,
      });
    } else {
      navigation.navigate('DragDropGamePlay', {
        levelId: activityId,
        competitionId: comp.competition_id,
        competitionScore: comp.score,
      });
    }
  };

  const handleLeaderboard = (comp: ICompetition) => {
    navigation.navigate('CompetitionLeaderboard', {
      competitionId: comp.competition_id,
      competitionTitle: comp.title,
    });
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
          <Text style={styles.headerTitle}>Cuộc thi</Text>
          <View style={styles.headerIconBox}>
            <MaterialCommunityIcons name="trophy" size={22} color="#F59E0B" />
          </View>
        </View>

        {/* Sub-header label */}
        <View style={styles.subHeaderRow}>
          <MaterialCommunityIcons name="school-outline" size={15} color={colors.text.secondary} />
          <Text style={styles.subHeaderText}>Danh sách cuộc thi</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Đang tải cuộc thi...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchCompetitions}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#F59E0B" colors={['#F59E0B']} />
            }
          >
            {competitions.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconBox}>
                  <MaterialCommunityIcons name="trophy-broken" size={48} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyTitle}>Không có cuộc thi</Text>
                <Text style={styles.emptySubtitle}>
                  Hiện chưa có cuộc thi nào dành cho bạn.{'\n'}Hãy kiểm tra lại sau!
                </Text>
              </View>
            ) : (
              competitions.map(comp => (
                <CompetitionCard
                  key={comp.competition_id}
                  competition={comp}
                  onPress={handlePressCompetition}
                  onLeaderboard={handleLeaderboard}
                />
              ))
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Confirmation Dialog */}
      <Modal
        visible={pendingCompetition !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingCompetition(null)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <View style={styles.dialogIconRow}>
              <View style={styles.dialogIconBg}>
                <MaterialCommunityIcons
                  name={
                    pendingCompetition && getCompetitionType(pendingCompetition) === 'QUIZ'
                      ? 'clipboard-check'
                      : 'gamepad-variant'
                  }
                  size={32}
                  color="#F59E0B"
                />
              </View>
            </View>
            <Text style={styles.dialogTitle}>
              {pendingCompetition && getCompetitionType(pendingCompetition) === 'QUIZ'
                ? 'Bắt đầu làm bài?'
                : 'Bắt đầu chơi?'}
            </Text>
            <Text style={styles.dialogExamTitle} numberOfLines={2}>
              {pendingCompetition?.title}
            </Text>
            <View style={styles.dialogMetaRow}>
              <View style={styles.dialogMetaChip}>
                <MaterialCommunityIcons name="trophy" size={14} color="#F59E0B" />
                <Text style={styles.dialogMetaText}>Cuộc thi</Text>
              </View>
              <View style={styles.dialogMetaChip}>
                <MaterialCommunityIcons
                  name={
                    pendingCompetition && getCompetitionType(pendingCompetition) === 'QUIZ'
                      ? 'clipboard-check'
                      : 'gamepad-variant'
                  }
                  size={14}
                  color="#F59E0B"
                />
                <Text style={styles.dialogMetaText}>
                  {pendingCompetition && getCompetitionType(pendingCompetition) === 'QUIZ'
                    ? 'Trắc nghiệm'
                    : 'Trò chơi'}
                </Text>
              </View>
            </View>
            <Text style={styles.dialogWarning}>
              {pendingCompetition && getCompetitionType(pendingCompetition) === 'QUIZ'
                ? 'Sau khi bắt đầu, thời gian sẽ được tính liên tục.'
                : 'Điểm sẽ được ghi nhận vào bảng xếp hạng cuộc thi.'}
            </Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={styles.dialogCancelBtn}
                onPress={() => setPendingCompetition(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.dialogCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogConfirmBtn}
                onPress={handleStartCompetition}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="play" size={18} color={colors.text.white} />
                <Text style={styles.dialogConfirmText}>Bắt đầu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Checking participant loading overlay */}
      <Modal
        visible={isCheckingParticipant}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.dialogOverlay}>
          <View style={[styles.dialogBox, { paddingVertical: 32, gap: 16 }]}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.dialogExamTitle}>Đang kiểm tra...</Text>
          </View>
        </View>
      </Modal>

      {/* Already done modal */}
      <Modal
        visible={alreadyDoneCompetition !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setAlreadyDoneCompetition(null)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <View style={styles.dialogIconRow}>
              <View style={[styles.dialogIconBg, { backgroundColor: '#D1FAE5' }]}>
                <MaterialCommunityIcons name="check-circle" size={32} color="#10B981" />
              </View>
            </View>
            <Text style={[styles.dialogTitle, { color: '#10B981' }]}>Đã hoàn thành!</Text>
            <Text style={styles.dialogExamTitle} numberOfLines={2}>
              {alreadyDoneCompetition?.title}
            </Text>
            <Text style={[styles.dialogWarning, { backgroundColor: '#D1FAE5', color: '#065F46' }]}>
              Bạn đã tham gia cuộc thi này rồi. Mỗi học sinh chỉ được tham gia một lần.
            </Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogCancelBtn, { flex: 1 }]}
                onPress={() => setAlreadyDoneCompetition(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.dialogCancelText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogConfirmBtn, { backgroundColor: '#10B981' }]}
                onPress={() => {
                  if (alreadyDoneCompetition) {
                    setAlreadyDoneCompetition(null);
                    handleLeaderboard(alreadyDoneCompetition);
                  }
                }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="trophy-outline" size={18} color={colors.text.white} />
                <Text style={styles.dialogConfirmText}>Xem BXH</Text>
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
    backgroundColor: '#FEF3C7',
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
  loadingWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: spacing.md,
  },
  // Exam card
  examCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 6,
    marginBottom: 16,
    padding: spacing.base,
    shadowColor: '#F59E0B',
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
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 14,
    borderWidth: 2,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  headerBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  typeBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    flex: 1,
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
  leaderboardButton: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderRadius: 14,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leaderboardButtonText: {
    color: '#B45309',
    fontSize: 14,
    fontWeight: '700',
  },
  upcomingNote: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: spacing.sm,
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
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#F59E0B',
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '700',
  },
  // Confirmation dialog
  dialogOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialogBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    width: '100%',
  },
  dialogIconRow: {
    marginBottom: 12,
  },
  dialogIconBg: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 50,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  dialogTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  dialogExamTitle: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 14,
    textAlign: 'center',
  },
  dialogMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 14,
  },
  dialogMetaChip: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dialogMetaText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '600',
  },
  dialogWarning: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    color: '#F59E0B',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'center',
    width: '100%',
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dialogCancelBtn: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1.5,
    flex: 1,
    paddingVertical: 13,
  },
  dialogCancelText: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: '700',
  },
  dialogConfirmBtn: {
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 13,
  },
  dialogConfirmText: {
    color: colors.text.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
