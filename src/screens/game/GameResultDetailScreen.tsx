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
    backgroundColor: '#E8F5E9',
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 2,
    height: 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 40,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    gap: spacing.sm,
    padding: spacing.base,
  },
  answerCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
    alignItems: 'center',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    position: 'relative',
    width: 64,
  },
  iconInnerCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  statusBadge: {
    alignItems: 'center',
    borderColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    bottom: -2,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    width: 24,
  },
  cardInfo: {
    flex: 1,
  },
  answerName: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  answerCategory: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  doneButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    elevation: 6,
    marginBottom: spacing.xl + 20,
    marginHorizontal: spacing.base,
    paddingVertical: spacing.base,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  doneButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal / Dialog
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialogContainer: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 12,
    maxWidth: 360,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    width: '100%',
  },
  dialogContent: {
    alignItems: 'center',
  },
  ecorotBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  ecorotText: {
    color: colors.text.white,
    fontSize: 11,
    fontWeight: '700',
  },
  dialogIconWrap: {
    alignItems: 'center',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 100,
  },
  dialogName: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  categoryTag: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryTagText: {
    color: colors.text.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  descriptionSection: {
    marginBottom: spacing.xl,
    paddingLeft: spacing.lg,
    position: 'relative',
    width: '100%',
  },
  quoteIcon: {
    left: 0,
    opacity: 0.4,
    position: 'absolute',
    top: -8,
  },
  descriptionText: {
    color: colors.text.secondary,
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  dialogDoneButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.base,
    width: '100%',
  },
  dialogDoneButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
