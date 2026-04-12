import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';
import { gameApi } from '../../services/api/game';

type GameResultDetailScreenRouteProp = RouteProp<AppStackParamList, 'GameResultDetail'>;

interface AnswerDetail {
  id: string;
  name: string;
  icon: string;
  description?: string;
  correctType: string;
  correctBinCode: 'PLASTIC' | 'PAPER' | 'ORGANIC' | 'OTHERS';
  userAnswer: string;
  code: 'PLASTIC' | 'PAPER' | 'ORGANIC' | 'OTHERS';
  isCorrect: boolean;
  orderIndex?: number;
  color: string;
  imageUrl?: string;
}

interface ResultSummary {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  duration: number;
  maxCombo: number;
  completed: boolean;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const toIconName = (name: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  return name as keyof typeof MaterialCommunityIcons.glyphMap;
};

const BIN_CODE_FALLBACK_NAME: Record<string, string> = {
  PLASTIC: 'Thùng nhựa',
  PAPER: 'Thùng giấy',
  ORGANIC: 'Thùng hữu cơ',
  OTHERS: 'Thùng rác khác',
};

const normalizeBinCode = (value?: string) =>
  String(value || '')
    .trim()
    .toUpperCase();

const getBinDisplayName = (
  rawName: string | undefined,
  code: string | undefined,
  binNameByCode: Record<string, string>
) => {
  const normalizedCode = normalizeBinCode(code || rawName);
  if (normalizedCode && binNameByCode[normalizedCode]) {
    const mappedName = binNameByCode[normalizedCode];
    const normalizedMappedName = normalizeBinCode(mappedName);
    if (BIN_CODE_FALLBACK_NAME[normalizedMappedName]) {
      return BIN_CODE_FALLBACK_NAME[normalizedMappedName];
    }
    return mappedName;
  }

  const normalizedRaw = normalizeBinCode(rawName);
  if (normalizedRaw && BIN_CODE_FALLBACK_NAME[normalizedRaw]) {
    return BIN_CODE_FALLBACK_NAME[normalizedRaw];
  }

  if (rawName && rawName.trim().length > 0) {
    const normalizedRawName = normalizeBinCode(rawName);
    if (BIN_CODE_FALLBACK_NAME[normalizedRawName]) {
      return BIN_CODE_FALLBACK_NAME[normalizedRawName];
    }
    return rawName;
  }

  return '--';
};

export default function GameResultDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<GameResultDetailScreenRouteProp>();
  const routeResults = route.params?.results || [];
  const routeSummary = route.params?.summary;
  const gameAttemptId = route.params?.gameAttemptId;
  const skipServerRefresh = route.params?.skipServerRefresh;
  const [results, setResults] = useState<AnswerDetail[]>(routeResults);
  const [binNameByCode, setBinNameByCode] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<AnswerDetail | null>(null);

  useEffect(() => {
    const mappedRouteResults = routeResults.map((item: AnswerDetail) => ({
      ...item,
      userAnswer: getBinDisplayName(item.userAnswer, item.code, binNameByCode),
      correctType: getBinDisplayName(item.correctType, item.correctBinCode, binNameByCode),
    }));

    setResults(mappedRouteResults);
  }, [routeResults, binNameByCode]);

  useEffect(() => {
    let isActive = true;

    const fetchDetailData = async () => {
      try {
        const bins = await gameApi.getWasteBins();
        const nextBinNameByCode = bins.reduce(
          (acc, bin) => {
            const normalizedCode = normalizeBinCode(bin.code);
            if (normalizedCode) {
              acc[normalizedCode] = bin.display_name;
            }
            return acc;
          },
          {} as Record<string, string>
        );

        if (!isActive) return;
        setBinNameByCode(nextBinNameByCode);

        if (!gameAttemptId || skipServerRefresh) {
          return;
        }

        const placementDetails = await gameApi.getPlacementDetails(gameAttemptId);
        const mappedResults: AnswerDetail[] = placementDetails.map((placement, index) => ({
          id: placement.waste_item.id,
          name: placement.waste_item.name,
          icon: placement.waste_item.image_url ? 'image' : 'recycle',
          description: placement.waste_item.description,
          correctType: getBinDisplayName(
            placement.waste_item.correct_bin_code,
            placement.waste_item.correct_bin_code,
            nextBinNameByCode
          ),
          correctBinCode: placement.waste_item.correct_bin_code,
          userAnswer: getBinDisplayName(placement.code, placement.code, nextBinNameByCode),
          code: placement.code,
          isCorrect: placement.is_correct,
          orderIndex: placement.waste_item.order_index ?? index + 1,
          color: colors.primary,
          imageUrl: placement.waste_item.image_url,
        }));

        if (!isActive) return;

        setResults(
          [...mappedResults].sort(
            (a, b) =>
              (a.orderIndex ?? Number.MAX_SAFE_INTEGER) - (b.orderIndex ?? Number.MAX_SAFE_INTEGER)
          )
        );
      } catch (error) {
        console.error('Khong the tai placement review:', error);
      }
    };

    fetchDetailData();

    return () => {
      isActive = false;
    };
  }, [gameAttemptId, skipServerRefresh]);

  const fallbackSummary = useMemo<ResultSummary>(() => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(item => item.isCorrect).length;

    return {
      score: correctAnswers * 10,
      correctAnswers,
      totalQuestions,
      duration: 0,
      maxCombo: 0,
      completed: true,
    };
  }, [results]);

  const summary = routeSummary || fallbackSummary;

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết kết quả</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View>
                <Text style={styles.summaryLabel}>Tổng điểm</Text>
                <Text style={styles.summaryScore}>{summary.score.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRightCol}>
                <View style={styles.summaryBadge}>
                  <MaterialCommunityIcons name="timer-outline" size={18} color={colors.primary} />
                  <Text style={styles.summaryBadgeText}>{formatDuration(summary.duration)}</Text>
                </View>
                <View
                  style={[
                    styles.completedBadge,
                    summary.completed ? styles.completedBadgeOn : styles.completedBadgeOff,
                  ]}
                >
                  <Text style={styles.completedBadgeText}>
                    {summary.completed ? 'COMPLETED' : 'IN_PROGRESS'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Đúng</Text>
                <Text style={styles.metricValue}>
                  {summary.correctAnswers}/{summary.totalQuestions}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Sai</Text>
                <Text style={styles.metricValue}>
                  {Math.max(0, summary.totalQuestions - summary.correctAnswers)}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Combo max</Text>
                <Text style={styles.metricValue}>{summary.maxCombo}x</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Danh sách câu trả lời</Text>

          <View style={styles.listContainer}>
            {results.map((answer: AnswerDetail, index: number) => (
              <TouchableOpacity
                key={`${answer.id}-${index}`}
                style={styles.answerCard}
                activeOpacity={0.8}
                onPress={() => setSelectedItem(answer)}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.iconWrap, { backgroundColor: `${answer.color}22` }]}>
                    {answer.imageUrl ? (
                      <Image
                        source={{ uri: answer.imageUrl }}
                        style={styles.answerImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={toIconName(answer.icon)}
                        size={34}
                        color={answer.color}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.answerName}>{answer.name}</Text>
                  <View style={styles.answerRow}>
                    <Text style={styles.answerRowLabel}>Thứ tự: </Text>
                    <Text style={styles.answerRowValue}>#{answer.orderIndex ?? index + 1}</Text>
                  </View>
                  <View style={styles.answerRow}>
                    <Text style={styles.answerRowLabel}>Thùng rác bạn chọn: </Text>
                    <Text style={styles.answerRowValue}>{answer.userAnswer}</Text>
                  </View>
                  <View style={styles.answerRow}>
                    <Text style={styles.answerRowLabel}>Thùng rác đúng: </Text>
                    <Text style={styles.answerRowValue}>{answer.correctType}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    answer.isCorrect ? styles.statusBadgeSuccess : styles.statusBadgeError,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={answer.isCorrect ? 'check' : 'close'}
                    size={14}
                    color={colors.text.white}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>ĐÃ HIỂU</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedItem(null)}>
          <Pressable style={styles.dialogContainer} onPress={event => event.stopPropagation()}>
            {selectedItem && (
              <View style={styles.dialogContent}>
                <View style={styles.dialogIconWrap}>
                  {selectedItem.imageUrl ? (
                    <Image
                      source={{ uri: selectedItem.imageUrl }}
                      style={styles.dialogImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={toIconName(selectedItem.icon)}
                      size={64}
                      color={selectedItem.color}
                    />
                  )}
                </View>

                <Text style={styles.dialogName}>{selectedItem.name}</Text>

                <View style={styles.answerCompareBox}>
                  <View style={styles.answerCompareRow}>
                    <MaterialCommunityIcons
                      name={selectedItem.isCorrect ? 'check-circle' : 'close-circle'}
                      size={18}
                      color={selectedItem.isCorrect ? colors.status.success : colors.status.error}
                    />
                    <Text style={styles.answerCompareLabel}>Thùng rác bạn chọn:</Text>
                    <Text style={styles.answerCompareValue}>{selectedItem.userAnswer}</Text>
                  </View>
                  <View style={styles.answerCompareRow}>
                    <MaterialCommunityIcons name="target" size={18} color={colors.primary} />
                    <Text style={styles.answerCompareLabel}>Thùng rác đúng:</Text>
                    <Text style={styles.answerCompareValue}>{selectedItem.correctType}</Text>
                  </View>
                </View>

                <View style={styles.descriptionSection}>
                  <Text style={styles.descriptionTitle}>Mô tả vật phẩm</Text>
                  <Text style={styles.descriptionText}>
                    {selectedItem.description || `Thong tin phan loai cho ${selectedItem.name}.`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.dialogDoneButton}
                  onPress={() => setSelectedItem(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dialogDoneButtonText}>ĐÓNG</Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  answerCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  answerCompareBox: {
    backgroundColor: '#F5FAF6',
    borderRadius: 14,
    gap: spacing.sm,
    marginBottom: spacing.base,
    padding: spacing.base,
    width: '100%',
  },
  answerCompareLabel: {
    color: colors.text.secondary,
    fontSize: 13,
    minWidth: 136,
  },
  answerCompareRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  answerCompareValue: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  answerImage: {
    borderRadius: 10,
    height: 44,
    width: 44,
  },
  answerName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  answerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  answerRowLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    minWidth: 122,
  },
  answerRowValue: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 2,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  cardBody: {
    flex: 1,
  },
  cardLeft: {
    marginRight: spacing.base,
  },
  container: {
    backgroundColor: '#E8F5E9',
    flex: 1,
    position: 'relative',
  },
  completedBadge: {
    borderRadius: borderRadius.full,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  completedBadgeOff: {
    backgroundColor: colors.text.disabled,
  },
  completedBadgeOn: {
    backgroundColor: colors.status.success,
  },
  completedBadgeText: {
    color: colors.text.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  descriptionSection: {
    width: '100%',
  },
  descriptionText: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
  },
  descriptionTitle: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  dialogContainer: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    elevation: 10,
    maxWidth: 360,
    padding: spacing.xl,
    width: '100%',
  },
  dialogContent: {
    alignItems: 'center',
  },
  dialogDoneButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
    paddingVertical: spacing.base,
    width: '100%',
  },
  dialogDoneButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
  dialogIconWrap: {
    alignItems: 'center',
    backgroundColor: '#F2F8F4',
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 96,
  },
  dialogImage: {
    borderRadius: 16,
    height: 64,
    width: 64,
  },
  dialogName: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  doneButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl + 20,
    marginHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  doneButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  listContainer: {
    paddingHorizontal: spacing.base,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    color: colors.text.secondary,
    fontSize: 11,
  },
  metricValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.base,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.sm,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  statusBadgeError: {
    backgroundColor: colors.status.error,
  },
  statusBadgeSuccess: {
    backgroundColor: colors.status.success,
  },
  summaryBadge: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  summaryBadgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 3,
    marginHorizontal: spacing.base,
    marginTop: spacing.xs,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 2,
  },
  summaryScore: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
  },
  summaryRightCol: {
    alignItems: 'flex-end',
  },
  summaryTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
