import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { competitionApi } from '../../services/api/competition';
import type { ICompetitionParticipant } from '../../types/competition';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';
import { useAuthStore } from '../../store/authStore';

type CompetitionLeaderboardRouteProp = RouteProp<AppStackParamList, 'CompetitionLeaderboard'>;

const ACCENT = '#F59E0B';

export default function CompetitionLeaderboardScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute<CompetitionLeaderboardRouteProp>();
  const { competitionId, competitionTitle } = route.params;
  const { user } = useAuthStore();

  const [participants, setParticipants] = useState<ICompetitionParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    try {
      setError(null);
      const data = await competitionApi.getCompetitionParticipants(competitionId);
      // Sort by total_score descending
      const sorted = [...data].sort((a, b) => b.total_score - a.total_score);
      setParticipants(sorted);
    } catch (err: any) {
      setError('Không thể tải bảng xếp hạng cuộc thi.');
      console.error('Error fetching competition participants:', err);
    } finally {
      setIsLoading(false);
    }
  }, [competitionId]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchParticipants();
    }, [fetchParticipants])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchParticipants();
    setIsRefreshing(false);
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return { name: 'medal', color: '#FFD700' };
    if (rank === 2) return { name: 'medal', color: '#C0C0C0' };
    if (rank === 3) return { name: 'medal', color: '#CD7F32' };
    return null;
  };

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Bảng xếp hạng
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {competitionTitle}
            </Text>
          </View>
          <View style={styles.headerIconBox}>
            <MaterialCommunityIcons name="trophy" size={22} color={ACCENT} />
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color={ACCENT} />
            <Text style={styles.loadingText}>Đang tải bảng xếp hạng...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerWrap}>
            <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchParticipants}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : participants.length === 0 ? (
          <View style={styles.centerWrap}>
            <MaterialCommunityIcons name="account-group-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Chưa có người tham gia</Text>
            <Text style={styles.emptySubtitle}>Hãy là người đầu tiên!</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={ACCENT} colors={[ACCENT]} />
            }
          >
            {participants.map((participant, index) => {
              const rank = index + 1;
              const medal = getMedalIcon(rank);
              const isMe = participant.student.student_id === user?.id;

              return (
                <View
                  key={participant.competition_participant_id}
                  style={[
                    styles.participantCard,
                    isMe && styles.participantCardMe,
                    rank <= 3 && styles.participantCardTop,
                  ]}
                >
                  {/* Rank */}
                  <View style={[styles.rankBox, rank <= 3 && { backgroundColor: medal?.color + '22' }]}>
                    {medal ? (
                      <MaterialCommunityIcons name={medal.name as any} size={24} color={medal.color} />
                    ) : (
                      <Text style={styles.rankNumber}>{rank}</Text>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.participantInfo}>
                    <Text style={[styles.participantName, isMe && styles.participantNameMe]} numberOfLines={1}>
                      {participant.student.full_name}
                      {isMe ? ' (Bạn)' : ''}
                    </Text>
                    {participant.student.grade && (
                      <Text style={styles.participantGrade}>Khối {participant.student.grade}</Text>
                    )}
                  </View>

                  {/* Score */}
                  <View style={styles.scoreBox}>
                    <MaterialCommunityIcons name="star" size={16} color={ACCENT} />
                    <Text style={styles.scoreText}>{participant.total_score}</Text>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </SafeAreaView>
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
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.md,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  headerIconBox: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  centerWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: spacing.md,
  },
  errorText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: ACCENT,
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
  emptyTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  emptySubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
  },
  participantCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  participantCardMe: {
    backgroundColor: '#FEF3C7',
    borderColor: ACCENT,
  },
  participantCardTop: {
    elevation: 4,
    shadowOpacity: 0.1,
  },
  rankBox: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  rankNumber: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '800',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  participantNameMe: {
    color: '#B45309',
    fontWeight: '800',
  },
  participantGrade: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scoreText: {
    color: '#B45309',
    fontSize: 16,
    fontWeight: '800',
  },
});
