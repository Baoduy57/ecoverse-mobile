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
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  safeArea: {
    flex: 1,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  titleContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  titleHighlight: {
    fontSize: 36,
    fontWeight: '900',
    color: '#4CAF50',
    letterSpacing: -0.5,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
  },
  missionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.base,
    marginBottom: spacing.md,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  difficultyBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text.white,
    letterSpacing: 0.5,
  },
  missionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  missionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#4CAF50',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  startButtonLocked: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.text.disabled,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
  },
  startButtonTextLocked: {
    color: colors.text.disabled,
  },
  quickPlayContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.base,
    right: spacing.base,
  },
  quickPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#FF6B6B',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF5252',
  },
  quickPlayText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text.white,
  },
});
