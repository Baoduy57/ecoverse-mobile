import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../theme';
import { QuizDifficulty, QuizStatus, QuizMission } from '../../types/quiz';
import { MOCK_QUIZ_MISSIONS } from '../../data/quizData';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';

type QuizCategory = 'all' | 'manual';

export default function QuizListScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('all');

  const getDifficultyLabel = (difficulty: QuizDifficulty): string => {
    switch (difficulty) {
      case QuizDifficulty.STARTER:
        return 'STARTER';
      case QuizDifficulty.AI_GENERATED:
        return 'AI-GENERATED';
      case QuizDifficulty.MANUAL:
        return 'MANUAL';
      case QuizDifficulty.HARD:
        return 'HARD';
      default:
        return '';
    }
  };

  const getDifficultyColor = (difficulty: QuizDifficulty): string => {
    switch (difficulty) {
      case QuizDifficulty.STARTER:
        return '#4CAF50';
      case QuizDifficulty.AI_GENERATED:
        return '#9C27B0';
      case QuizDifficulty.MANUAL:
        return '#FF9800';
      case QuizDifficulty.HARD:
        return '#F44336';
      default:
        return colors.primary;
    }
  };

  const filteredMissions = MOCK_QUIZ_MISSIONS.filter(mission => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'manual') return mission.difficulty === QuizDifficulty.MANUAL;
    return true;
  });

  const handleStartQuiz = (mission: QuizMission) => {
    if (mission.status === QuizStatus.LOCKED) {
      return;
    }
    navigation.navigate('QuizQuestion', { quizId: mission.id });
  };

  return (
    <View style={styles.container}>
      {/* Background */}
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
          <View style={styles.userBadge}>
            <Image
              source={require('../../../assets/images/default-avatar.jpg')}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Lv 12</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Chọn nhiệm vụ</Text>
          <Text style={styles.titleHighlight}>Của bạn</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedCategory === 'all' && styles.tabActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[styles.tabText, selectedCategory === 'all' && styles.tabTextActive]}>
              Tất cả các bài kiểm tra
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedCategory === 'manual' && styles.tabActive]}
            onPress={() => setSelectedCategory('manual')}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={16}
              color={selectedCategory === 'manual' ? colors.background : colors.text.secondary}
            />
            <Text style={[styles.tabText, selectedCategory === 'manual' && styles.tabTextActive]}>
              Thủ công
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quiz List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredMissions.map(mission => (
            <View key={mission.id} style={styles.missionCard}>
              {/* Difficulty Badge */}
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(mission.difficulty) },
                ]}
              >
                <Text style={styles.difficultyText}>{getDifficultyLabel(mission.difficulty)}</Text>
              </View>

              <View style={styles.missionContent}>
                <View style={[styles.iconContainer, { backgroundColor: mission.bgColor }]}>
                  <MaterialCommunityIcons
                    name={mission.icon as any}
                    size={40}
                    color={mission.iconColor}
                  />
                </View>

                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <View style={styles.missionMeta}>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons name="trophy" size={14} color={colors.accent} />
                      <Text style={styles.metaText}>{mission.xpReward} XP</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons
                        name="help-circle-outline"
                        size={14}
                        color={colors.text.secondary}
                      />
                      <Text style={styles.metaText}>{mission.questionsCount} câu</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.startButton,
                  mission.status === QuizStatus.LOCKED && styles.startButtonLocked,
                ]}
                onPress={() => handleStartQuiz(mission)}
                disabled={mission.status === QuizStatus.LOCKED}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.startButtonText,
                    mission.status === QuizStatus.LOCKED && styles.startButtonTextLocked,
                  ]}
                >
                  Bắt đầu nhiệm vụ
                </Text>
                <MaterialCommunityIcons
                  name={mission.status === QuizStatus.LOCKED ? 'lock' : 'play'}
                  size={20}
                  color={
                    mission.status === QuizStatus.LOCKED ? colors.text.disabled : colors.text.white
                  }
                />
              </TouchableOpacity>
            </View>
          ))}

          {/* Bottom padding */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Quick Play Button */}
        <View style={styles.quickPlayContainer}>
          <TouchableOpacity
            style={styles.quickPlayButton}
            activeOpacity={0.8}
            onPress={() => {
              const firstUnlocked = MOCK_QUIZ_MISSIONS.find(m => m.status === QuizStatus.UNLOCKED);
              if (firstUnlocked) {
                navigation.navigate('QuizQuestion', { quizId: firstUnlocked.id });
              }
            }}
          >
            <MaterialCommunityIcons name="flash" size={20} color={colors.text.white} />
            <Text style={styles.quickPlayText}>Chơi nhanh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    elevation: 3,
    height: 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 40,
  },
  container: {
    backgroundColor: '#F0F9FF',
    flex: 1,
  },
  difficultyBadge: {
    borderRadius: borderRadius.sm,
    elevation: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    position: 'absolute',
    right: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    top: spacing.md,
  },
  difficultyText: {
    color: colors.text.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    borderColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  missionCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 6,
    marginBottom: spacing.md,
    padding: spacing.base,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  missionContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  missionInfo: {
    flex: 1,
  },
  missionMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  missionTitle: {
    color: colors.text.primary,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  quickPlayButton: {
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderColor: '#FF5252',
    borderRadius: borderRadius.full,
    borderWidth: 2,
    elevation: 8,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.md,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  quickPlayContainer: {
    bottom: spacing.xl,
    left: spacing.base,
    position: 'absolute',
    right: spacing.base,
  },
  quickPlayText: {
    color: colors.text.white,
    fontSize: 17,
    fontWeight: '800',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
  },
  scrollView: {
    flex: 1,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: borderRadius.lg,
    elevation: 5,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.md,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  startButtonLocked: {
    backgroundColor: colors.surface,
    borderColor: colors.text.disabled,
    borderWidth: 1,
  },
  startButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
  },
  startButtonTextLocked: {
    color: colors.text.disabled,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: 'transparent',
    borderRadius: borderRadius.full,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.text.white,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  title: {
    color: colors.text.primary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  titleContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  titleHighlight: {
    color: '#4CAF50',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  userBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    elevation: 3,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userName: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
