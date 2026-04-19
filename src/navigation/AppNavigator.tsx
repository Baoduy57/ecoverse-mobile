import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AIScannerScreen, AIWasteHistoryScreen } from '../screens/ai';
import { EditAvatarScreen, SettingsScreen } from '../screens/profile';
import { RewardHistoryScreen } from '../screens/reward';
import { DragDropGamePlayScreen, GameHistoryScreen, GameResultDetailScreen } from '../screens/game';
import { QuizListScreen, QuizQuestionScreen, QuizResultScreen } from '../screens/quiz';
import { ScheduledExamScreen, ExamQuestionScreen, ExamResultScreen, CompetitionLeaderboardScreen } from '../screens/exam';
import { NotificationScreen } from '../screens/notification';
import { DevApiTestScreen } from '../screens/dev';
import { QuizAnswer, QuizAnswerDetail, StudentQuizSubmitResult } from '../types/quiz';
import type { StudentQuizPlacement } from '../types/quiz';
import TabNavigator, { HomeTabParamList } from './TabNavigator';
import { NavigatorScreenParams } from '@react-navigation/native';

export type AppStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  AIScanner: undefined;
  AIWasteHistory: undefined;
  EditAvatar: undefined;
  Settings: undefined;
  RewardHistory: undefined;
  Notification: undefined;
  GameHistory: { gameRoundId: string; gameRoundTitle: string };
  DragDropGamePlay: { levelId: string | number; gameAttemptId?: string; competitionId?: string };
  GameResultDetail: {
    gameAttemptId?: string;
    skipServerRefresh?: boolean;
    results: Array<{
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
    }>;
    summary?: {
      score: number;
      correctAnswers: number;
      totalQuestions: number;
      duration: number;
      maxCombo: number;
      completed: boolean;
    };
  };
  QuizList: undefined;
  QuizQuestion: { templateId: string; title?: string };
  QuizResult: { attempt: StudentQuizSubmitResult };
  QuizAnswerDetail: { answerDetails: QuizAnswerDetail[] };
  ScheduledExam: undefined;
  ExamQuestion: {
    examId?: string;
    competitionId?: string;
    quizTemplateId?: string;
  };
  ExamResult: {
    examId?: string;
    competitionId?: string;
    // Real result fields from quiz API
    quizTitle?: string;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalPoints: number;
    duration?: number;
    placements?: StudentQuizPlacement[];
    // Legacy mock-based fields
    answers?: QuizAnswer[];
  };
  CompetitionLeaderboard: { competitionId: string; competitionTitle: string };
  DevApiTest: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen
        name="AIScanner"
        component={AIScannerScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="AIWasteHistory"
        component={AIWasteHistoryScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="EditAvatar"
        component={EditAvatarScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="RewardHistory"
        component={RewardHistoryScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="GameHistory"
        component={GameHistoryScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="DragDropGamePlay"
        component={DragDropGamePlayScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="GameResultDetail"
        component={GameResultDetailScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="QuizList"
        component={QuizListScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="QuizQuestion"
        component={QuizQuestionScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="ExamQuestion"
        component={ExamQuestionScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="ExamResult"
        component={ExamResultScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="ScheduledExam"
        component={ScheduledExamScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="CompetitionLeaderboard"
        component={CompetitionLeaderboardScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="DevApiTest"
        component={DevApiTestScreen}
        options={{
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}
