import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type GameResultDetailScreenRouteProp = RouteProp<AppStackParamList, 'GameResultDetail'>;

interface AnswerDetail {
  id: string;
  name: string;
  icon: string;
  description?: string;
  correctType: string;
  correctTypeIcon?: string;
  userAnswer: string;
  isCorrect: boolean;
  color: string;
}

const getCategoryLabel = (typeName: string) => {
  const map: Record<string, string> = {
    'Hữu cơ': 'RÁC HỮU CƠ',
    'Tái chế': 'RÁC TÁI CHẾ',
    'Nguy hại': 'RÁC NGUY HẠI',
    Khác: 'RÁC KHÁC',
  };
  return map[typeName] || typeName.toUpperCase();
};

export default function GameResultDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<GameResultDetailScreenRouteProp>();
  const results: AnswerDetail[] = route.params?.results || [];
  const [selectedItem, setSelectedItem] = useState<AnswerDetail | null>(null);

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết câu trả lời</Text>
          <View style={styles.backButton} />
        </View>

        {/* List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.listContainer}>
            {results.map((answer: AnswerDetail, index: number) => (
              <TouchableOpacity
                key={`answer-${index}`}
                style={[
                  styles.answerCard,
                  index === 0 && styles.answerCardFirst,
                  index === results.length - 1 && styles.answerCardLast,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedItem(answer)}
              >
                <View style={styles.cardIconSection}>
                  <View style={[styles.iconOuterCircle, { backgroundColor: answer.color + '25' }]}>
                    <View style={styles.iconInnerCircle}>
                      <MaterialCommunityIcons
                        name={answer.icon as any}
                        size={36}
                        color={answer.color}
                      />
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: answer.isCorrect
                            ? colors.status.success
                            : colors.status.error,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={answer.isCorrect ? 'check' : 'close'}
                        size={14}
                        color={colors.text.white}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.answerName}>{answer.name}</Text>
                  <Text style={[styles.answerCategory, { color: answer.color }]}>
                    {getCategoryLabel(answer.correctType)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>ĐÃ HIỂU</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Item Detail Dialog */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedItem(null)}>
          <Pressable style={styles.dialogContainer} onPress={e => e.stopPropagation()}>
            {selectedItem && (
              <View style={styles.dialogContent}>
                {/* ECOROT badge */}
                <View style={styles.ecorotBadge}>
                  <MaterialCommunityIcons name="robot" size={14} color={colors.text.white} />
                  <Text style={styles.ecorotText}>ECOROT</Text>
                </View>

                {/* Icon */}
                <View
                  style={[styles.dialogIconWrap, { backgroundColor: selectedItem.color + '20' }]}
                >
                  <MaterialCommunityIcons
                    name={selectedItem.icon as any}
                    size={64}
                    color={selectedItem.color}
                  />
                </View>

                {/* Name */}
                <Text style={styles.dialogName}>{selectedItem.name}</Text>

                {/* Category tag */}
                <View
                  style={[
                    styles.categoryTag,
                    { backgroundColor: selectedItem.color, opacity: 0.9 },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={(selectedItem.correctTypeIcon || 'delete') as any}
                    size={16}
                    color={colors.text.white}
                  />
                  <Text style={styles.categoryTagText}>
                    {getCategoryLabel(selectedItem.correctType)}
                  </Text>
                </View>

                {/* Description with quote */}
                <View style={styles.descriptionSection}>
                  <MaterialCommunityIcons
                    name="format-quote-open"
                    size={32}
                    color={colors.primary}
                    style={styles.quoteIcon}
                  />
                  <Text style={styles.descriptionText}>
                    {selectedItem.description || `Thông tin về ${selectedItem.name}.`}
                  </Text>
                </View>

                {/* Close button */}
                <TouchableOpacity
                  style={styles.dialogDoneButton}
                  onPress={() => setSelectedItem(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dialogDoneButtonText}>ĐÃ HIỂU</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: spacing.base,
    gap: spacing.sm,
  },
  answerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.base,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  answerCardFirst: {
    marginTop: spacing.xs,
  },
  answerCardLast: {
    marginBottom: spacing.lg,
  },
  cardIconSection: {
    marginRight: spacing.md,
  },
  iconOuterCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconInnerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  cardInfo: {
    flex: 1,
  },
  answerName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  answerCategory: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.base,
    marginHorizontal: spacing.base,
    marginBottom: spacing.xl + 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
  },
  // Modal / Dialog
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  dialogContent: {
    alignItems: 'center',
  },
  ecorotBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  ecorotText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.white,
  },
  dialogIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dialogName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  categoryTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.white,
    letterSpacing: 0.5,
  },
  descriptionSection: {
    width: '100%',
    marginBottom: spacing.xl,
    position: 'relative',
    paddingLeft: spacing.lg,
  },
  quoteIcon: {
    position: 'absolute',
    left: 0,
    top: -8,
    opacity: 0.4,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  dialogDoneButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  dialogDoneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
  },
});
