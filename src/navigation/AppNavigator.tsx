import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AIScannerScreen } from '../screens/ai';
import { EditAvatarScreen, SettingsScreen } from '../screens/profile';
import { RewardHistoryScreen } from '../screens/reward';
import { DragDropGamePlayScreen, GameResultDetailScreen } from '../screens/game';
import { QuizListScreen, QuizQuestionScreen, QuizResultScreen } from '../screens/quiz';
import { ScheduledExamScreen, ExamQuestionScreen, ExamResultScreen } from '../screens/exam';
import { NotificationScreen } from '../screens/notification';
import { DevApiTestScreen } from '../screens/dev';
import { QuizAnswer, QuizAnswerDetail, StudentQuizSubmitResult } from '../types/quiz';
import TabNavigator, { HomeTabParamList } from './TabNavigator';
import { NavigatorScreenParams } from '@react-navigation/native';

export type AppStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  AIScanner: undefined;
  EditAvatar: undefined;
  Settings: undefined;
  RewardHistory: undefined;
  Notification: undefined;
  DragDropGamePlay: { levelId: number };
  GameResultDetail: { results: any[] };
  QuizList: undefined;
  QuizQuestion: { templateId: string; title?: string };
  QuizResult: { attempt: StudentQuizSubmitResult };
  QuizAnswerDetail: { answerDetails: QuizAnswerDetail[] };
  ScheduledExam: undefined;
  ExamQuestion: { examId: string };
  ExamResult: {
    examId: string;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalPoints: number;
    answers: QuizAnswer[];
  };
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
        name="DevApiTest"
        component={DevApiTestScreen}
        options={{
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}
